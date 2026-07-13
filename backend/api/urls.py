from django.urls import path
from .dashboard import dashboard_summary
from .views import (
    dataset_list,
    dataset_detail,
    upload_dataset,
    profile_api,
    cleaning_api,
    delete_dataset,
)

urlpatterns = [
    path("dashboard/", dashboard_summary),
    path("datasets/", dataset_list),
    path("datasets/<int:dataset_id>/", dataset_detail),
    path("datasets/upload/", upload_dataset),
    path("profile/<int:dataset_id>/", profile_api),
    path("clean/<int:dataset_id>/",cleaning_api),
    path("datasets/<int:dataset_id>/delete/",delete_dataset),
]