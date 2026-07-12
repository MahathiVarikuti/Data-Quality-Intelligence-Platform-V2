import re
import pandas as pd


class QualityService:
    """
    Contains all dataset quality assessment logic.
    """

    EMAIL_PATTERN = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"

    QUALITY_WEIGHTS = {
        "completeness": 0.30,
        "uniqueness": 0.25,
        "validity": 0.25,
        "consistency": 0.20,
    }

    @staticmethod
    def compute_report(df: pd.DataFrame):
        total_missing = int(df.isnull().sum().sum())
        duplicate_count = int(df.duplicated().sum())
        invalid_email_count = 0
        invalid_email_samples = []
        QualityService.EMAIL_PATTERN
        for col in df.columns:
            if 'email' in col.lower():
                inv = df[col].dropna().astype(str)
                inv = inv[~inv.str.match(QualityService.EMAIL_PATTERN)]
                invalid_email_count += len(inv)
                invalid_email_samples.extend(inv.head(5).tolist())
        total_cells = df.shape[0] * df.shape[1] if df.shape[0] > 0 and df.shape[1] > 0 else 1
        missing_pct = (total_missing / total_cells) * 100
        dup_pct = (duplicate_count / len(df)) * 100 if len(df) > 0 else 0
        email_pct = (invalid_email_count / len(df)) * 100 if len(df) > 0 else 0
        completeness_score = max(0, round(100 - missing_pct, 2))
        uniqueness_score = max(0, round(100 - dup_pct, 2))
        validity_score = max(0, round(100 - email_pct, 2))
        consistency_score = 100.0
        overall_score = round(
            (completeness_score * QualityService.QUALITY_WEIGHTS["completeness"])
            + (uniqueness_score * QualityService.QUALITY_WEIGHTS["uniqueness"])
            + (validity_score * QualityService.QUALITY_WEIGHTS["validity"])
            + (consistency_score * QualityService.QUALITY_WEIGHTS["consistency"]),
            2,
        )
        issue_summary, recommendations = [], []
        if total_missing > 0:
            issue_summary.append(f"Dataset contains {total_missing} missing values.")
            recommendations.append("Use 'Fill Missing Values' to handle null entries per column.")
        if duplicate_count > 0:
            issue_summary.append(f"Dataset contains {duplicate_count} duplicate rows.")
            recommendations.append("Use 'Remove Duplicate Rows' to improve uniqueness.")
        if invalid_email_count > 0:
            issue_summary.append(f"Dataset contains {invalid_email_count} invalid email values.")
            recommendations.append("Review and correct malformed email values.")
        if total_missing == 0 and duplicate_count == 0 and invalid_email_count == 0:
            issue_summary.append("No major quality issues detected.")
            recommendations.append("Dataset quality looks good. You can export the cleaned version.")
        return {
            'completeness_score': completeness_score, 'uniqueness_score': uniqueness_score,
            'validity_score': validity_score, 'consistency_score': consistency_score,
            'overall_score': overall_score, 'total_missing': total_missing,
            'duplicate_count': duplicate_count, 'invalid_email_count': invalid_email_count,
            'invalid_email_samples': invalid_email_samples,
            'issue_summary': issue_summary, 'recommendations': recommendations,
        }

    @staticmethod
    def column_statistics(df: pd.DataFrame):
        pass