import { useState } from "react";
import { cleanDataset } from "../../api/dataset";

export default function RemoveColumnsModal({
  datasetId,
  profile,
  onClose,
}) {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [removing, setRemoving] = useState(false);

  const columns = profile?.column_profile || [];

  function toggleColumn(columnName) {
    setSelectedColumns((prev) =>
      prev.includes(columnName)
        ? prev.filter((name) => name !== columnName)
        : [...prev, columnName]
    );
  }

  async function handleRemove() {
    if (selectedColumns.length === 0) {
      alert("Please select at least one column.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${selectedColumns.length} column(s)?`
    );

    if (!confirmed) return;

    try {
      setRemoving(true);

      const response = await cleanDataset(
        datasetId,
        "columns",
        {
          columns: selectedColumns,
        }
      );

      console.log("Remove columns response:", response);

      alert(
        `${selectedColumns.length} column(s) removed successfully.`
      );

      window.location.reload();

    } catch (error) {
      console.error(error);

      alert("Failed to remove columns.");

    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-6">

          <div>
            <h2 className="text-2xl font-bold">
              Remove Columns
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select columns you want to permanently remove from the dataset.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-3xl text-slate-500 hover:text-red-500"
          >
            ×
          </button>

        </div>

        {/* Body */}

        <div className="max-h-[60vh] overflow-y-auto p-6">

          {columns.length === 0 ? (

            <div className="py-10 text-center text-slate-500">
              No columns available.
            </div>

          ) : (

            <div className="space-y-3">

              {columns.map((col) => {

                const selected =
                  selectedColumns.includes(col.name);

                return (
                  <label
                    key={col.name}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                      selected
                        ? "border-indigo-500 bg-indigo-50"
                        : "hover:bg-slate-50"
                    }`}
                  >

                    <div className="flex items-center gap-4">

                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          toggleColumn(col.name)
                        }
                        className="h-4 w-4"
                      />

                      <div>
                        <p className="font-medium">
                          {col.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {col.type}
                        </p>
                      </div>

                    </div>

                    <span className="text-sm text-slate-500">
                      {col.missing ?? 0} missing
                    </span>

                  </label>
                );

              })}

            </div>

          )}

        </div>

        {/* Footer */}

        <div className="flex items-center justify-between border-t p-6">

          <p className="text-sm text-slate-500">
            {selectedColumns.length} column(s) selected
          </p>

          <div className="flex gap-3">

            <button
              onClick={onClose}
              className="rounded-lg border px-5 py-2 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              onClick={handleRemove}
              disabled={
                removing ||
                selectedColumns.length === 0
              }
              className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {removing
                ? "Removing..."
                : "Remove Columns"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}