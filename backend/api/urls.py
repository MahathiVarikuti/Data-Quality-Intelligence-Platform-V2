from django.urls import path
from .dashboard import dashboard_summary
from .views import (
    dataset_list,
    dataset_detail,
    upload_dataset,
    report_api,
    profile_api,
)

urlpatterns = [
    path("dashboard/", dashboard_summary),
    path("datasets/", dataset_list),
    path("datasets/<int:dataset_id>/", dataset_detail),
    path("datasets/upload/", upload_dataset),
    path("report/<int:dataset_id>/", report_api),
    path("profile/<int:dataset_id>/", profile_api),
]