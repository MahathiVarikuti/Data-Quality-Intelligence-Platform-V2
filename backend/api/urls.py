from django.urls import path
from .dashboard import dashboard_summary
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    dataset_list,
    dataset_detail,
    upload_dataset,
    report_api,
    profile_api,
    cleaning_api,
    delete_dataset,
    export_dataset,
    rename_dataset,
    detect_outliers_api,
    undo_cleaning_api,
    restore_original_api,
    register_api,
)

urlpatterns = [
    path("dashboard/", dashboard_summary),
    path("datasets/", dataset_list),
    path("datasets/<int:dataset_id>/", dataset_detail),
    path("datasets/upload/", upload_dataset),
    path("datasets/<int:dataset_id>/report/", report_api),
    path("profile/<int:dataset_id>/", profile_api),
    path("clean/<int:dataset_id>/",cleaning_api),
    path("datasets/<int:dataset_id>/delete/",delete_dataset),
    path("datasets/<int:dataset_id>/rename/",rename_dataset,),
    path("datasets/<int:dataset_id>/export/",export_dataset),
    path("datasets/<int:dataset_id>/outliers/",detect_outliers_api,),
    path("datasets/<int:dataset_id>/undo/",undo_cleaning_api,),
    path("datasets/<int:dataset_id>/restore/",restore_original_api,),
    path("auth/register/", register_api),
    path("auth/login/",TokenObtainPairView.as_view(),),
    path("auth/token/refresh/",TokenRefreshView.as_view(),),
]