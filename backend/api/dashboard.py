from collections import Counter

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from datasets.models import Dataset, ValidationReport


@api_view(["GET"])
@permission_classes([AllowAny])
def dashboard_summary(request):

    datasets = Dataset.objects.all()

    total = datasets.count()

    cleaned = datasets.filter(status="cleaned").count()
    validated = datasets.filter(status="validated").count()
    profiled = datasets.filter(status="profiled").count()
    uploaded = datasets.filter(status="uploaded").count()

    rows = sum(dataset.num_rows or 0 for dataset in datasets)

    reports = ValidationReport.objects.all()

    scores = [
        report.overall_score
        for report in reports
        if report.overall_score is not None
    ]

    average = round(sum(scores) / len(scores), 2) if scores else 0

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
            "averageScore": average,
            "statusChart": status_chart,
        }
    )