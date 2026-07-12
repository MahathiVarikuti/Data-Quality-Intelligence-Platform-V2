from rest_framework import serializers
from datasets.models import Dataset, ValidationReport


class ValidationReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValidationReport
        fields = [
            "completeness_score",
            "uniqueness_score",
            "validity_score",
            "consistency_score",
            "overall_score",
            "total_missing",
            "duplicate_count",
            "invalid_email_count",
            "invalid_type_count",
            "issue_summary",
            "recommendations",
        ]


class DatasetSerializer(serializers.ModelSerializer):
    report = ValidationReportSerializer(read_only=True)

    class Meta:
        model = Dataset
        fields = [
            "id",
            "name",
            "uploaded_at",
            "file_size",
            "num_rows",
            "num_columns",
            "status",
            "initial_missing_count",
            "initial_duplicate_count",
            "initial_overall_score",
            "report",
        ]