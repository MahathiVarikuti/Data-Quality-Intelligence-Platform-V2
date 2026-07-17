from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from datasets.models import Dataset, ValidationReport
from datasets.services.dataset_service import DatasetService
from datasets.services.quality_service import QualityService
from datasets.services.profile_service import ProfileService
from datasets.services.cleaning_service import CleaningService


from .serializers import DatasetSerializer
from rest_framework import status

from django.http import FileResponse


@api_view(["GET"])
@permission_classes([AllowAny])
def dataset_list(request):
    datasets = Dataset.objects.all().order_by("-uploaded_at")
    serializer = DatasetSerializer(datasets, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def dataset_detail(request, dataset_id):
    dataset = get_object_or_404(Dataset, id=dataset_id)
    serializer = DatasetSerializer(dataset)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([AllowAny])
def upload_dataset(request):
    uploaded_file = request.FILES.get("file")

    if not uploaded_file:
        return Response(
            {"error": "No file uploaded"},
            status=400,
        )

    dataset = Dataset.objects.create(
        user=User.objects.first(),
        name=uploaded_file.name,
        file=uploaded_file,
        status="uploaded",
    )

    # Load CSV
    df = DatasetService.load(dataset)

    # Update metadata
    DatasetService.update_metadata(dataset, df, status="profiled")

    # Generate report
    report = QualityService.compute_report(df)

    ValidationReport.objects.create(
        dataset=dataset,
        completeness_score=report["completeness_score"],
        uniqueness_score=report["uniqueness_score"],
        validity_score=report["validity_score"],
        consistency_score=report["consistency_score"],
        overall_score=report["overall_score"],
        total_missing=report["total_missing"],
        duplicate_count=report["duplicate_count"],
        invalid_email_count=report["invalid_email_count"],
        issue_summary=report["issue_summary"],
        recommendations=report["recommendations"],
    )

    dataset.initial_missing_count = report["total_missing"]
    dataset.initial_duplicate_count = report["duplicate_count"]
    dataset.initial_overall_score = report["overall_score"]
    dataset.status = "validated"
    dataset.save()

    return Response(
        {
            "id": dataset.id,
            "name": dataset.name,
            "status": dataset.status,
        },
        status=201,
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def report_api(request, dataset_id):
    dataset = get_object_or_404(Dataset, id=dataset_id)
    report = get_object_or_404(
        ValidationReport,
        dataset=dataset,
    )

    return Response(
        {
            "dataset": dataset.name,
            "overall_score": report.overall_score,
            "completeness_score": report.completeness_score,
            "uniqueness_score": report.uniqueness_score,
            "validity_score": report.validity_score,
            "consistency_score": report.consistency_score,
            "missing": report.total_missing,
            "duplicates": report.duplicate_count,
            "invalid_emails": report.invalid_email_count,
            "issues": report.issue_summary,
            "recommendations": report.recommendations,
        }
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def profile_api(request, dataset_id):

    dataset = get_object_or_404(Dataset, id=dataset_id)

    df = DatasetService.load(dataset)

    profile = ProfileService.generate_profile(df)

    return Response(profile)


@api_view(["POST"])
@permission_classes([AllowAny])
def cleaning_api(request, dataset_id):

    dataset = get_object_or_404(
        Dataset,
        id=dataset_id,
    )

    action = request.data.get("action")

    old_report = ValidationReport.objects.get(
        dataset=dataset
    )

    # Create permanent original backup.
    # This is only created once.
    DatasetService.create_original_backup(
        dataset
    )

    # Save current state for one-level undo.
    # This gets replaced before every cleaning action.
    DatasetService.create_undo_backup(
        dataset
    )

    # Load current dataset for cleaning.
    df = DatasetService.load(dataset)

    if action == "duplicates":
        cleaned = CleaningService.remove_duplicates(df)

    elif action == "missing":

        strategies = request.data.get(
            "strategies",
            {},
        )

        custom_values = request.data.get(
            "customValues",
            {},
        )

        cleaned = CleaningService.fill_missing(
            df,
            strategies=strategies,
            custom_values=custom_values,
        )

    elif action == "normalize":

        columns = request.data.get(
            "columns",
            [],
        )

        operation = request.data.get(
            "operation",
            "trim",
        )

        cleaned = CleaningService.normalize_text(
            df,
            columns=columns,
            operation=operation,
        )

    elif action == "outliers":

        columns = request.data.get(
            "columns",
            [],
        )

        cleaned = CleaningService.remove_outliers(
            df,
            columns=columns,
        )

    elif action == "columns":
        columns = request.data.get("columns", [])
        cleaned = CleaningService.remove_columns(df, columns)

    else:
        return Response(
            {"error": "Invalid action"},
            status=400,
        )

    DatasetService.save(dataset, cleaned)

    DatasetService.update_metadata(
        dataset,
        cleaned,
        status="cleaned",
    )

    report = QualityService.compute_report(cleaned)

    ValidationReport.objects.update_or_create(
        dataset=dataset,
        defaults={
            "completeness_score": report["completeness_score"],
            "uniqueness_score": report["uniqueness_score"],
            "validity_score": report["validity_score"],
            "consistency_score": report["consistency_score"],
            "overall_score": report["overall_score"],
            "total_missing": report["total_missing"],
            "duplicate_count": report["duplicate_count"],
            "invalid_email_count": report["invalid_email_count"],
            "invalid_type_count": report["invalid_type_count"],
            "issue_summary": report["issue_summary"],
            "recommendations": report["recommendations"],
        },
    )

    dataset.initial_missing_count = report["total_missing"]
    dataset.initial_duplicate_count = report["duplicate_count"]
    dataset.initial_overall_score = report["overall_score"]
    dataset.save()

    return Response({

        "success": True,

        "action": action,

        "rows": len(cleaned),

        "columns": len(cleaned.columns),

        "before": {

            "overall": old_report.overall_score,

            "missing": old_report.total_missing,

            "duplicates": old_report.duplicate_count,

        },

        "after": {

            "overall": report["overall_score"],

            "missing": report["total_missing"],

            "duplicates": report["duplicate_count"],

        }

    })


@api_view(["POST"])
@permission_classes([AllowAny])
def undo_cleaning_api(request, dataset_id):

    dataset = get_object_or_404(
        Dataset,
        id=dataset_id,
    )

    restored = DatasetService.undo_last_action(
        dataset
    )

    if not restored:
        return Response(
            {
                "success": False,
                "message": "No cleaning action available to undo.",
            },
            status=400,
        )

    # Load restored dataset
    df = DatasetService.load(dataset)

    # Update rows, columns and file size
    DatasetService.update_metadata(
        dataset,
        df,
        status="validated",
    )

    # Recalculate quality report
    report = QualityService.compute_report(df)

    ValidationReport.objects.update_or_create(
        dataset=dataset,
        defaults={
            "completeness_score": report["completeness_score"],
            "uniqueness_score": report["uniqueness_score"],
            "validity_score": report["validity_score"],
            "consistency_score": report["consistency_score"],
            "overall_score": report["overall_score"],
            "total_missing": report["total_missing"],
            "duplicate_count": report["duplicate_count"],
            "invalid_email_count": report["invalid_email_count"],
            "invalid_type_count": report["invalid_type_count"],
            "issue_summary": report["issue_summary"],
            "recommendations": report["recommendations"],
        },
    )

    return Response({
        "success": True,
        "message": "Last cleaning action undone successfully.",
        "rows": len(df),
        "columns": len(df.columns),
        "overallScore": report["overall_score"],
    })



@api_view(["POST"])
@permission_classes([AllowAny])
def restore_original_api(request, dataset_id):

    dataset = get_object_or_404(
        Dataset,
        id=dataset_id,
    )

    restored = DatasetService.restore_original(
        dataset
    )

    if not restored:
        return Response(
            {
                "success": False,
                "message": "Original dataset backup is not available.",
            },
            status=400,
        )

    # Load original dataset
    df = DatasetService.load(dataset)

    # Update metadata
    DatasetService.update_metadata(
        dataset,
        df,
        status="validated",
    )

    # Recalculate quality report
    report = QualityService.compute_report(df)

    ValidationReport.objects.update_or_create(
        dataset=dataset,
        defaults={
            "completeness_score": report["completeness_score"],
            "uniqueness_score": report["uniqueness_score"],
            "validity_score": report["validity_score"],
            "consistency_score": report["consistency_score"],
            "overall_score": report["overall_score"],
            "total_missing": report["total_missing"],
            "duplicate_count": report["duplicate_count"],
            "invalid_email_count": report["invalid_email_count"],
            "invalid_type_count": report["invalid_type_count"],
            "issue_summary": report["issue_summary"],
            "recommendations": report["recommendations"],
        },
    )

    return Response({
        "success": True,
        "message": "Dataset restored to its original version.",
        "rows": len(df),
        "columns": len(df.columns),
        "overallScore": report["overall_score"],
    })


@api_view(["GET"])
@permission_classes([AllowAny])
def detect_outliers_api(request, dataset_id):

    dataset = get_object_or_404(
        Dataset,
        id=dataset_id,
    )

    df = DatasetService.load(dataset)

    outliers = CleaningService.detect_outliers(df)

    return Response({
        "dataset": dataset.name,
        "outliers": outliers,
    })




@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_dataset(request, dataset_id):

    dataset = get_object_or_404(
        Dataset,
        id=dataset_id,
    )

    DatasetService.delete_file(dataset)

    dataset.delete()

    return Response(
        {"success": True},
        status=status.HTTP_204_NO_CONTENT,
    )


@api_view(["PATCH"])
@permission_classes([AllowAny])
def rename_dataset(request, dataset_id):

    dataset = get_object_or_404(
        Dataset,
        id=dataset_id,
    )

    new_name = request.data.get("name", "").strip()

    if not new_name:
        return Response(
            {"error": "Name is required"},
            status=400,
        )

    dataset.name = new_name
    dataset.save()

    return Response(
        {
            "success": True,
            "name": dataset.name,
        }
    )


from django.http import FileResponse

@api_view(["GET"])
@permission_classes([AllowAny])
def export_dataset(request, dataset_id):

    dataset = get_object_or_404(
        Dataset,
        id=dataset_id,
    )

    response = FileResponse(
        open(dataset.file.path, "rb"),
        content_type="text/csv",
    )

    response["Content-Disposition"] = (
        f'attachment; filename="{dataset.name}.csv"'
    )

    return response