import pandas as pd
from pandas.api.types import is_numeric_dtype

class CleaningService:

    @staticmethod
    def remove_duplicates(df: pd.DataFrame):
        return df.drop_duplicates()

    @staticmethod
    def fill_missing(df: pd.DataFrame):

        cleaned = df.copy()

        for column in cleaned.columns:

            if is_numeric_dtype(cleaned[column]):

                cleaned[column] = cleaned[column].fillna(
                    cleaned[column].mean()
                )

            else:

                mode = cleaned[column].mode()

                if not mode.empty:
                    cleaned[column] = cleaned[column].fillna(mode.iloc[0])

        return cleaned

    @staticmethod
    def normalize_text(df: pd.DataFrame):

        cleaned = df.copy()

        for column in cleaned.select_dtypes(include="object"):

            cleaned[column] = (
                cleaned[column]
                .astype(str)
                .str.strip()
                .str.title()
            )

        return cleaned

    @staticmethod
    def remove_columns(df: pd.DataFrame, columns):

        return df.drop(columns=columns, errors="ignore")

    @staticmethod
    def remove_outliers(df: pd.DataFrame):

        cleaned = df.copy()

        numeric_columns = cleaned.select_dtypes(include="number").columns

        for column in numeric_columns:

            q1 = cleaned[column].quantile(0.25)
            q3 = cleaned[column].quantile(0.75)

            iqr = q3 - q1

            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr

            cleaned = cleaned[
                (cleaned[column] >= lower)
                & (cleaned[column] <= upper)
            ]

        return cleaned