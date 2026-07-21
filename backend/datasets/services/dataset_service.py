"""
Dataset service layer.

Handles all dataset file operations and metadata updates.
Views should never directly read or write CSV files.
"""

from __future__ import annotations

import os
import shutil

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
    def get_original_backup_path(dataset: Dataset) -> str:
        """Return the path used to store the original uploaded dataset."""

        return f"{dataset.file.path}.original"


    @staticmethod
    def get_undo_backup_path(dataset: Dataset) -> str:
        """Return the path used for one-level undo."""

        return f"{dataset.file.path}.undo"


    @staticmethod
    def create_original_backup(dataset: Dataset) -> None:
        """
        Create a permanent backup of the original dataset.

        The backup is created only once so it always represents
        the dataset as originally uploaded.
        """

        original_path = DatasetService.get_original_backup_path(
            dataset
        )

        if not os.path.exists(original_path):
            shutil.copy2(
                dataset.file.path,
                original_path,
            )


    @staticmethod
    def create_undo_backup(dataset: Dataset) -> None:
        """
        Save the current dataset state before a cleaning action.

        The previous undo backup is replaced, giving us
        one-level undo functionality.
        """

        undo_path = DatasetService.get_undo_backup_path(
            dataset
        )

        shutil.copy2(
            dataset.file.path,
            undo_path,
        )


    @staticmethod
    def undo_last_action(dataset: Dataset) -> bool:
        """
        Restore the dataset to the state before
        the most recent cleaning action.
        """

        undo_path = DatasetService.get_undo_backup_path(
            dataset
        )

        if not os.path.exists(undo_path):
            return False

        shutil.copy2(
            undo_path,
            dataset.file.path,
        )

        # Remove backup after undo so the same
        # action cannot be undone repeatedly.
        os.remove(undo_path)

        return True


    @staticmethod
    def restore_original(dataset: Dataset) -> bool:
        """
        Restore the dataset to its original uploaded state.
        """

        original_path = DatasetService.get_original_backup_path(
            dataset
        )

        if not os.path.exists(original_path):
            return False

        shutil.copy2(
            original_path,
            dataset.file.path,
        )

        return True

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
        """Delete dataset and backup files."""

        paths = [
            dataset.file.path,
            DatasetService.get_original_backup_path(dataset),
            DatasetService.get_undo_backup_path(dataset),
        ]

        for path in paths:
            if os.path.exists(path):
                os.remove(path)