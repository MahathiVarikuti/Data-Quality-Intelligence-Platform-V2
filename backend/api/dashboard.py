from collections import Counter

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from datasets.models import Dataset, ValidationReport


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):

    datasets = Dataset.objects.filter(
        user=request.user
    )
    total = datasets.count()

    cleaned = datasets.filter(status="cleaned").count()
    validated = datasets.filter(status="validated").count()
    profiled = datasets.filter(status="profiled").count()
    uploaded = datasets.filter(status="uploaded").count()

    rows = sum(dataset.num_rows or 0 for dataset in datasets)
    storage = sum(
        dataset.file_size or 0
        for dataset in datasets
    )

    storage_mb = round(
        storage / (1024 * 1024),
        2,
    )
    reports = list(
        ValidationReport.objects.filter(
            dataset__user=request.user
        )
    )

    scores = [
        report.overall_score
        for report in reports
        if report.overall_score is not None
    ]

    average = round(sum(scores) / len(scores), 2) if scores else 0
    quality_distribution = {
        "excellent": 0,
        "good": 0,
        "fair": 0,
        "poor": 0,
    }

    for score in scores:

        if score >= 90:
            quality_distribution["excellent"] += 1

        elif score >= 75:
            quality_distribution["good"] += 1

        elif score >= 60:
            quality_distribution["fair"] += 1

        else:
            quality_distribution["poor"] += 1

    radar = {
        "completeness": round(
            sum(r.completeness_score for r in reports) / len(reports),
            2,
        ) if reports else 0,

        "uniqueness": round(
            sum(r.uniqueness_score for r in reports) / len(reports),
            2,
        ) if reports else 0,

        "validity": round(
            sum(r.validity_score for r in reports) / len(reports),
            2,
        ) if reports else 0,

        "consistency": round(
            sum(r.consistency_score for r in reports) / len(reports),
            2,
        ) if reports else 0,
    }

    cleaning_required = []

    for report in reports:

        if report.overall_score < 60:

            cleaning_required.append({

                "id": report.dataset.id,

                "name": report.dataset.name,

                "score": report.overall_score,

                "missing": report.total_missing,

                "duplicates": report.duplicate_count,
                "status": report.dataset.status,
                "uploaded": report.dataset.uploaded_at,

            })

    cleaning_required.sort(
        key=lambda x: x["score"]
    )

    alerts = []

    for report in reports:

        if report.overall_score < 60:

            alerts.append({

                "dataset": report.dataset.name,

                "message": "Overall quality below 60%",

                "severity": "critical",

            })

        elif report.total_missing > 0:

            alerts.append({

                "dataset": report.dataset.name,

                "message": f"{report.total_missing} missing values",

                "severity": "warning",

            })

        elif report.duplicate_count > 0:

            alerts.append({

                "dataset": report.dataset.name,

                "message": f"{report.duplicate_count} duplicate rows",

                "severity": "info",

            })

    severity_order = {
        "critical": 0,
        "warning": 1,
        "info": 2,
    }

    alerts.sort(
        key=lambda x: severity_order[x["severity"]]
    )  

    status_chart = [
        {
            "status": status,
            "count": count,
        }
        for status, count in Counter(
            dataset.status for dataset in datasets
        ).items()
    ]

    return Response(
        {
            "totalDatasets": total,
            "cleaned": cleaned,
            "validated": validated,
            "profiled": profiled,
            "uploaded": uploaded,

            "rowsProcessed": rows,
            "storageUsed": storage_mb,

            "averageScore": average,

            "statusChart": status_chart,

            "qualityDistribution": quality_distribution,

            "qualityRadar": radar,

            "cleaningRequired": cleaning_required,

            "latestAlerts": alerts[:5],
        }
    )