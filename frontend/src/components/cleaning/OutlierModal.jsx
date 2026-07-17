import { useEffect, useState } from "react";

import {
  getOutliers,
  cleanDataset,
} from "../../api/dataset";

export default function OutlierModal({
  datasetId,
  onClose,
}) {

  const [outliers, setOutliers] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {

    async function loadOutliers() {

      try {

        const data = await getOutliers(datasetId);

        setOutliers(data.outliers || []);

      } catch (error) {

        console.error(error);

        alert("Failed to scan dataset for outliers.");

      } finally {

        setLoading(false);

      }

    }

    loadOutliers();

  }, [datasetId]);


  function toggleColumn(column) {

    setSelectedColumns((prev) =>

      prev.includes(column)

        ? prev.filter(
            (item) => item !== column
          )

        : [
            ...prev,
            column,
          ]

    );

  }


  async function handleRemove() {

    if (selectedColumns.length === 0) {

      alert(
        "Please select at least one column with outliers."
      );

      return;

    }

    const confirmed = window.confirm(
      `Remove outlier rows from ${selectedColumns.length} selected column(s)?`
    );

    if (!confirmed) return;


    try {

      setRemoving(true);

      const response = await cleanDataset(
        datasetId,
        "outliers",
        {
          columns: selectedColumns,
        }
      );

      console.log(
        "Outlier cleaning response:",
        response
      );

      alert(
        `Outliers removed successfully.\n\n` +
        `Rows remaining: ${response.rows}`
      );

      window.location.reload();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to remove outliers."
      );

    } finally {

      setRemoving(false);

    }

  }


  const detectedOutliers = outliers.filter(
    (item) => item.count > 0
  );


  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-2xl font-bold">
              Outlier Detection
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review IQR-based outlier detection results before removing rows.
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

          {loading ? (

            <div className="py-16 text-center text-slate-500">
              Scanning numeric columns...
            </div>

          ) : detectedOutliers.length === 0 ? (

            <div className="rounded-xl border border-green-200 bg-green-50 p-10 text-center">

              <h3 className="text-xl font-semibold text-green-700">
                No Outliers Detected
              </h3>

              <p className="mt-2 text-slate-600">
                No statistical outliers were found using the IQR method.
              </p>

            </div>

          ) : (

            <div className="overflow-hidden rounded-xl border">

              <table className="w-full">

                <thead className="border-b bg-slate-50">

                  <tr>

                    <th className="p-4 text-left">
                      Select
                    </th>

                    <th className="p-4 text-left">
                      Column
                    </th>

                    <th className="p-4 text-center">
                      Outliers
                    </th>

                    <th className="p-4 text-center">
                      IQR Range
                    </th>

                    <th className="p-4 text-center">
                      Data Range
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {detectedOutliers.map(
                    (item) => (

                      <tr
                        key={item.column}
                        className="border-b last:border-b-0 hover:bg-slate-50"
                      >

                        <td className="p-4">

                          <input
                            type="checkbox"
                            checked={
                              selectedColumns.includes(
                                item.column
                              )
                            }
                            onChange={() =>
                              toggleColumn(
                                item.column
                              )
                            }
                            className="h-4 w-4"
                          />

                        </td>


                        <td className="p-4 font-medium">

                          {item.column}

                        </td>


                        <td className="p-4 text-center">

                          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">

                            {item.count}

                          </span>

                        </td>


                        <td className="p-4 text-center text-sm text-slate-600">

                          {item.lower_bound}
                          {" → "}
                          {item.upper_bound}

                        </td>


                        <td className="p-4 text-center text-sm text-slate-600">

                          {item.min_value}
                          {" → "}
                          {item.max_value}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

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
              className="rounded-lg bg-purple-600 px-5 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {removing
                ? "Removing..."
                : "Remove Selected Outliers"}

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}