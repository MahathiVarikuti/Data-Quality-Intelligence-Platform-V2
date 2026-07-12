"""
Dataset service layer.

Handles all dataset file operations and metadata updates.
Views should never directly read or write CSV files.
"""

from __future__ import annotations

import os

import pandas as pd

from datasets.models import Dataset


class DatasetService:
    """Service class for dataset operations."""

    @staticmethod
    def load(dataset: Dataset) -> pd.DataFrame:
        """Load a dataset from disk into a DataFrame."""
        return pd.read_csv(dataset.file.path)

    @staticmethod
    def save(dataset: Dataset, dataframe: pd.DataFrame) -> None:
        """Save a DataFrame back to the dataset file."""
        dataframe.to_csv(dataset.file.path, index=False)

    @staticmethod
    def update_metadata(
        dataset: Dataset,
        dataframe: pd.DataFrame,
        status: str | None = None,
    ) -> None:
        """Update dataset metadata after file modifications."""

        dataset.num_rows = dataframe.shape[0]
        dataset.num_columns = dataframe.shape[1]
        dataset.file_size = os.path.getsize(dataset.file.path)

        if status:
            dataset.status = status

        dataset.save()

    @staticmethod
    def delete_file(dataset: Dataset) -> None:
        """Delete the dataset file from disk."""

        if os.path.exists(dataset.file.path):
            os.remove(dataset.file.path)