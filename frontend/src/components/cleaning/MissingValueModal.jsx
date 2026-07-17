import { useState } from "react";
import { cleanDataset } from "../../api/dataset";

export default function MissingValueModal({
  datasetId,
  profile,
  onClose,
}) {
  const missingColumns = profile.column_profile.filter(
    (col) => col.missing > 0
  );

  const [strategies, setStrategies] = useState({});
  const [customValues, setCustomValues] = useState({});
  const [applying, setApplying] = useState(false);
  function updateStrategy(column, value) {
    setStrategies((prev) => ({
      ...prev,
      [column]: value,
    }));
  }

  function handleCustomValueChange(column, value) {
    setCustomValues((prev) => ({
      ...prev,
      [column]: value,
    }));
  }

  async function handleApply() {
    if (Object.keys(strategies).length === 0) {
      alert("Please select at least one cleaning strategy.");
      return;
    }

    try {
      setApplying(true);

      const response = await cleanDataset(
        datasetId,
        "missing",
        {
          strategies,
          customValues,
        }
      );

      console.log("Cleaning response:", response);

      alert(
        `Cleaning completed!\n\n` +
        `Missing Values: ${response.before.missing} → ${response.after.missing}\n` +
        `Overall Score: ${response.before.overall}% → ${response.after.overall}%`
      );

      window.location.reload();

    } catch (error) {
      console.error(error);
      alert("Failed to clean missing values.");
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-bold">
            Fill Missing Values
          </h2>

          <button
            onClick={onClose}
            className="text-3xl text-slate-500 hover:text-red-500"
          >
            ×
          </button>

        </div>

        {/* Body */}

        <div className="max-h-[65vh] space-y-5 overflow-y-auto p-6">

          {missingColumns.length === 0 ? (

            <div className="rounded-xl border bg-green-50 p-8 text-center">

              <h3 className="text-xl font-semibold text-green-700">
                No Missing Values
              </h3>

              <p className="mt-2 text-slate-600">
                This dataset doesn't contain any missing values.
              </p>

            </div>

          ) : (

            missingColumns.map((col) => {

              const numeric =
                col.type.toLowerCase().includes("int") ||
                col.type.toLowerCase().includes("float");

              return (

                <div
                  key={col.name}
                  className="grid grid-cols-[2fr_1fr_2fr] items-center gap-6 rounded-xl border p-5"
                >

                  {/* Column Info */}

                  <div>

                    <h3 className="font-semibold text-lg">
                      {col.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {numeric ? "Numeric Column" : "Text Column"}
                    </p>

                  </div>

                  {/* Missing Count */}

                  <div className="text-center">

                    <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">

                      {col.missing} Missing

                    </span>

                  </div>

                  {/* Strategy */}

                  <div>

                    <select
                      value={strategies[col.name] || ""}
                      onChange={(e) =>
                        updateStrategy(
                          col.name,
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border p-3"
                    >

                      <option value="">
                        Select Strategy
                      </option>

                      {numeric ? (
                        <>
                          <option value="mean">
                            Mean
                          </option>

                          <option value="median">
                            Median
                          </option>

                          <option value="custom">
                            Custom Value
                          </option>

                          <option value="drop">
                            Drop Row
                          </option>
                        </>
                      ) : (
                        <>
                          <option value="mode">
                            Mode
                          </option>

                          <option value="custom">
                            Custom Value
                          </option>

                          <option value="drop">
                            Drop Row
                          </option>
                        </>
                      )}

                    </select>

                    {/* Custom Value Input */}

                    {strategies[col.name] === "custom" && (

                      <input
                        type="text"
                        placeholder={`Enter value for ${col.name}`}
                        value={customValues[col.name] || ""}
                        onChange={(e) =>
                          handleCustomValueChange(
                            col.name,
                            e.target.value
                          )
                        }
                        className="mt-3 w-full rounded-lg border p-3 outline-none focus:border-indigo-500"
                      />

                    )}

                  </div>

                </div>

              );

            })

          )}

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t p-6">

          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            disabled={applying || missingColumns.length === 0}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {applying ? "Applying..." : "Apply"}
          </button>

        </div>

      </div>

    </div>
  );
}