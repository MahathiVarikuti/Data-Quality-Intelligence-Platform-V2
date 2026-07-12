import pandas as pd


class ProfileService:

    @staticmethod
    def generate_profile(df: pd.DataFrame):

        column_profile = []

        for column in df.columns:

            series = df[column]

            column_profile.append({
                "name": column,
                "type": str(series.dtype),
                "missing": int(series.isna().sum()),
                "unique": int(series.nunique()),
            })

        return {
            "rows": len(df),
            "columns": len(df.columns),
            "missing_total": int(df.isna().sum().sum()),
            "duplicate_rows": int(df.duplicated().sum()),
            "column_profile": column_profile,
            "preview": df.head(5).fillna("").to_dict(
                orient="records"
            ),
        }