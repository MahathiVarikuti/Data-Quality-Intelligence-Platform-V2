import pandas as pd


class ProfileService:

    @staticmethod
    def generate_profile(df: pd.DataFrame):

        column_profile = []

        for column in df.columns:

            series = df[column]

            info = {
                "name": column,
                "type": str(series.dtype),
                "missing": int(series.isna().sum()),
                "unique": int(series.nunique()),
            }

            if pd.api.types.is_numeric_dtype(series):

                info["mean"] = (
                    round(float(series.mean()), 2)
                    if not series.dropna().empty
                    else None
                )

                info["median"] = (
                    round(float(series.median()), 2)
                    if not series.dropna().empty
                    else None
                )

                info["min"] = (
                    float(series.min())
                    if not series.dropna().empty
                    else None
                )

                info["max"] = (
                    float(series.max())
                    if not series.dropna().empty
                    else None
                )

            else:

                info["top_values"] = (
                    series.value_counts()
                    .head(3)
                    .index.tolist()
                )

            column_profile.append(info)

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