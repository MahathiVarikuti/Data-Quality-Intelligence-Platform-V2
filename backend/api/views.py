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

    dataset = get_object_or_404(Dataset, id=dataset_id)

    action = request.data.get("action")

    df = DatasetService.load(dataset)

    if action == "duplicates":
        cleaned = CleaningService.remove_duplicates(df)

    elif action == "missing":
        cleaned = CleaningService.fill_missing(df)

    elif action == "normalize":
        cleaned = CleaningService.normalize_text(df)

    elif action == "outliers":
        cleaned = CleaningService.remove_outliers(df)

    elif action == "columns":
        columns = request.data.get("columns", [])
        cleaned = CleaningService.remove_columns(df, columns)

    else:
        return Response(
            {"error": "Invalid action"},
            status=400,
        )

    DatasetService.save(dataset, cleaned)
    DatasetService.update_metadata(dataset, cleaned)

    return Response({
        "success": True,
        "rows": len(cleaned),
        "columns": len(cleaned.columns),
    })