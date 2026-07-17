import { useState } from "react";
import { cleanDataset } from "../../api/dataset";

export default function NormalizeTextModal({
  datasetId,
  profile,
  onClose,
}) {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [operation, setOperation] = useState("trim");
  const [applying, setApplying] = useState(false);

  // Show only text/object columns
  const textColumns = (profile?.column_profile || []).filter(
    (col) => {
      const type = col.type.toLowerCase();

      return (
        type.includes("object") ||
        type.includes("string") ||
        type.includes("text")
      );
    }
  );

  function toggleColumn(columnName) {
    setSelectedColumns((prev) =>
      prev.includes(columnName)
        ? prev.filter((name) => name !== columnName)
        : [...prev, columnName]
    );
  }

  async function handleApply() {
    if (selectedColumns.length === 0) {
      alert("Please select at least one text column.");
      return;
    }

    try {
      setApplying(true);

      const response = await cleanDataset(
        datasetId,
        "normalize",
        {
          columns: selectedColumns,
          operation,
        }
      );

      console.log(
        "Text normalization response:",
        response
      );

      alert(
        `Text normalization completed successfully.\n\n` +
        `${selectedColumns.length} column(s) processed.`
      );

      window.location.reload();

    } catch (error) {
      console.error(error);

      alert("Failed to normalize text.");

    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-6">

          <div>
            <h2 className="text-2xl font-bold">
              Normalize Text
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select text columns and choose how their values should be standardized.
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

        <div className="max-h-[65vh] overflow-y-auto p-6">

          <div className="grid gap-8 md:grid-cols-2">

            {/* Column Selection */}

            <div>

              <h3 className="mb-4 text-lg font-semibold">
                Select Columns
              </h3>

              {textColumns.length === 0 ? (

                <div className="rounded-xl border bg-slate-50 p-6 text-center text-slate-500">
                  No text columns found.
                </div>

              ) : (

                <div className="space-y-3">

                  {textColumns.map((col) => {

                    const selected =
                      selectedColumns.includes(col.name);

                    return (
                      <label
                        key={col.name}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                          selected
                            ? "border-green-500 bg-green-50"
                            : "hover:bg-slate-50"
                        }`}
                      >

                        <div className="flex items-center gap-3">

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

                            <p className="text-xs text-slate-500">
                              {col.type}
                            </p>

                          </div>

                        </div>

                      </label>
                    );

                  })}

                </div>

              )}

            </div>


            {/* Transformation */}

            <div>

              <h3 className="mb-4 text-lg font-semibold">
                Transformation
              </h3>

              <div className="space-y-3">

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 hover:bg-slate-50">

                  <input
                    type="radio"
                    name="operation"
                    value="trim"
                    checked={operation === "trim"}
                    onChange={(e) =>
                      setOperation(e.target.value)
                    }
                    className="mt-1"
                  />

                  <div>
                    <p className="font-medium">
                      Trim Whitespace
                    </p>

                    <p className="text-sm text-slate-500">
                      Remove leading and trailing spaces.
                    </p>
                  </div>

                </label>


                <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 hover:bg-slate-50">

                  <input
                    type="radio"
                    name="operation"
                    value="lowercase"
                    checked={operation === "lowercase"}
                    onChange={(e) =>
                      setOperation(e.target.value)
                    }
                    className="mt-1"
                  />

                  <div>
                    <p className="font-medium">
                      lowercase
                    </p>

                    <p className="text-sm text-slate-500">
                      Convert all text to lowercase.
                    </p>
                  </div>

                </label>


                <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 hover:bg-slate-50">

                  <input
                    type="radio"
                    name="operation"
                    value="uppercase"
                    checked={operation === "uppercase"}
                    onChange={(e) =>
                      setOperation(e.target.value)
                    }
                    className="mt-1"
                  />

                  <div>
                    <p className="font-medium">
                      UPPERCASE
                    </p>

                    <p className="text-sm text-slate-500">
                      Convert all text to uppercase.
                    </p>
                  </div>

                </label>


                <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 hover:bg-slate-50">

                  <input
                    type="radio"
                    name="operation"
                    value="titlecase"
                    checked={operation === "titlecase"}
                    onChange={(e) =>
                      setOperation(e.target.value)
                    }
                    className="mt-1"
                  />

                  <div>
                    <p className="font-medium">
                      Title Case
                    </p>

                    <p className="text-sm text-slate-500">
                      Capitalize the first letter of each word.
                    </p>
                  </div>

                </label>

              </div>

            </div>

          </div>

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
              onClick={handleApply}
              disabled={
                applying ||
                selectedColumns.length === 0
              }
              className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {applying
                ? "Applying..."
                : "Apply Normalization"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}