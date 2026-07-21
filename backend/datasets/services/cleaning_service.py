import pandas as pd
from pandas.api.types import is_numeric_dtype


class CleaningService:

    @staticmethod
    def remove_duplicates(df: pd.DataFrame):
        return df.drop_duplicates()

    @staticmethod
    def fill_missing(
        df: pd.DataFrame,
        strategies=None,
        custom_values=None,
    ):
        cleaned = df.copy()

        strategies = strategies or {}
        custom_values = custom_values or {}

        # If no strategies are provided,
        # keep the old automatic cleaning behaviour.
        if not strategies:

            for column in cleaned.columns:

                if is_numeric_dtype(cleaned[column]):

                    cleaned[column] = cleaned[column].fillna(
                        cleaned[column].mean()
                    )

                else:

                    mode = cleaned[column].mode()

                    if not mode.empty:
                        cleaned[column] = cleaned[column].fillna(
                            mode.iloc[0]
                        )

            return cleaned

        # Apply user-selected strategy column by column.
        for column, strategy in strategies.items():

            # Ignore invalid/non-existing columns.
            if column not in cleaned.columns:
                continue

            if strategy == "mean":

                if is_numeric_dtype(cleaned[column]):
                    cleaned[column] = cleaned[column].fillna(
                        cleaned[column].mean()
                    )

            elif strategy == "median":

                if is_numeric_dtype(cleaned[column]):
                    cleaned[column] = cleaned[column].fillna(
                        cleaned[column].median()
                    )

            elif strategy == "mode":

                mode = cleaned[column].mode()

                if not mode.empty:
                    cleaned[column] = cleaned[column].fillna(
                        mode.iloc[0]
                    )

            elif strategy == "custom":

                if column in custom_values:

                    custom_value = custom_values[column]

                    # Try to preserve numeric column type.
                    if is_numeric_dtype(cleaned[column]):

                        try:
                            custom_value = pd.to_numeric(
                                custom_value
                            )

                        except (ValueError, TypeError):
                            continue

                    cleaned[column] = cleaned[column].fillna(
                        custom_value
                    )

            elif strategy == "drop":

                cleaned = cleaned.dropna(
                    subset=[column]
                )

        return cleaned

    @staticmethod
    def normalize_text(
        df: pd.DataFrame,
        columns=None,
        operation="trim",
    ):

        cleaned = df.copy()

        # Get all text columns
        text_columns = cleaned.select_dtypes(
            include="object"
        ).columns.tolist()

        # If user selected specific columns,
        # only normalize valid text columns.
        if columns:
            text_columns = [
                column
                for column in columns
                if column in text_columns
            ]

        for column in text_columns:

            # Preserve missing values while cleaning text.
            series = cleaned[column]

            if operation == "trim":

                cleaned[column] = series.apply(
                    lambda value:
                    value.strip()
                    if isinstance(value, str)
                    else value
                )

            elif operation == "lowercase":

                cleaned[column] = series.apply(
                    lambda value:
                    value.strip().lower()
                    if isinstance(value, str)
                    else value
                )

            elif operation == "uppercase":

                cleaned[column] = series.apply(
                    lambda value:
                    value.strip().upper()
                    if isinstance(value, str)
                    else value
                )

            elif operation == "titlecase":

                cleaned[column] = series.apply(
                    lambda value:
                    value.strip().title()
                    if isinstance(value, str)
                    else value
                )

        return cleaned

    @staticmethod
    def remove_columns(df, columns):

        if len(columns) >= len(df.columns):
            return df

        return df.drop(
            columns=columns,
            errors="ignore",
        )

    @staticmethod
    def remove_outliers(
        df: pd.DataFrame,
        columns=None,
    ):

        cleaned = df.copy()

        # If columns were selected by the user,
        # only process those columns.
        if columns:
            numeric_columns = [
                column
                for column in columns
                if column in cleaned.columns
                and is_numeric_dtype(cleaned[column])
            ]

        else:
            numeric_columns = cleaned.select_dtypes(
                include="number"
            ).columns

        for column in numeric_columns:

            # Calculate bounds from the current column.
            series = cleaned[column].dropna()

            if series.empty:
                continue

            q1 = series.quantile(0.25)
            q3 = series.quantile(0.75)

            iqr = q3 - q1

            lower = q1 - (1.5 * iqr)
            upper = q3 + (1.5 * iqr)

            # Keep:
            # 1. Non-outlier values
            # 2. Missing values
            #
            # Missing values should be handled separately
            # by the Missing Values cleaning action.
            cleaned = cleaned[
                cleaned[column].isna()
                | (
                    (cleaned[column] >= lower)
                    & (cleaned[column] <= upper)
                )
            ]

        return cleaned
    

    @staticmethod
    def detect_outliers(df: pd.DataFrame):

        results = []

        numeric_columns = df.select_dtypes(
            include="number"
        ).columns

        for column in numeric_columns:

            series = df[column].dropna()

            if series.empty:
                continue

            q1 = series.quantile(0.25)
            q3 = series.quantile(0.75)

            iqr = q3 - q1

            lower = q1 - (1.5 * iqr)
            upper = q3 + (1.5 * iqr)

            outliers = series[
                (series < lower) |
                (series > upper)
            ]

            results.append({
                "column": column,
                "count": len(outliers),
                "lower_bound": round(float(lower), 2),
                "upper_bound": round(float(upper), 2),
                "min_value": round(float(series.min()), 2),
                "max_value": round(float(series.max()), 2),
            })

        return results