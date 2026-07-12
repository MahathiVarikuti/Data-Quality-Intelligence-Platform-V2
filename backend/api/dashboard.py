from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from datasets.models import Dataset, ValidationReport


@api_view(["GET"])
@permission_classes([AllowAny])
def dashboard_summary(request):
    datasets = Dataset.objects.all()

    total = datasets.count()

    reports = ValidationReport.objects.count()

    rows = sum(d.num_rows or 0 for d in datasets)

    scores = [
        r.overall_score
        for r in ValidationReport.objects.all()
    ]

    average = round(sum(scores) / len(scores), 2) if scores else 0

    return Response(
        {
            "totalDatasets": total,
            "qualityReports": reports,
            "rowsProcessed": rows,
            "averageScore": average,
        }
    )