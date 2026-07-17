import { useState } from "react";
import {
    CopyMinus,
    FileWarning,
    ChartNoAxesCombined,
    Columns3,
    CaseSensitive,
} from "lucide-react";
import MissingValueModal from "./MissingValueModal";
import RemoveColumnsModal from "./RemoveColumnsModal";
import OutlierModal from "./OutlierModal";
import NormalizeTextModal from "./NormalizeTextModal";

import {
  cleanDataset,
  undoCleaning,
  restoreOriginal,
} from "../../api/dataset";
export default function CleaningPanel({ datasetId, profile}) {

  const [result, setResult] = useState(null);
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [showRemoveColumnsModal, setShowRemoveColumnsModal] =useState(false);
  const [showOutlierModal, setShowOutlierModal] =useState(false);
  const [showNormalizeModal, setShowNormalizeModal] =useState(false);
  const [restoring, setRestoring] = useState(false);

  async function run(action) {

    try {

      const response = await cleanDataset(
        datasetId,
        action
      );

      setResult(response);

    } catch (err) {

      console.error(err);

      alert("Cleaning failed.");

    }

  }


  async function handleUndo() {

    try {

        setRestoring(true);

        const response = await undoCleaning(datasetId);

        alert(
        response.message ||
        "Last cleaning action undone successfully."
        );

        window.location.reload();

    } catch (error) {

        console.error(error);

        alert(
        error.response?.data?.message ||
        "No cleaning action available to undo."
        );

    } finally {

        setRestoring(false);

    }

    }


    async function handleRestoreOriginal() {

    const confirmed = window.confirm(
        "Restore the original dataset? All cleaning changes will be discarded."
    );

    if (!confirmed) return;

    try {

        setRestoring(true);

        const response = await restoreOriginal(
        datasetId
        );

        alert(
        response.message ||
        "Dataset restored successfully."
        );

        window.location.reload();

    } catch (error) {

        console.error(error);

        alert(
        error.response?.data?.message ||
        "Failed to restore original dataset."
        );

    } finally {

        setRestoring(false);

    }

    }

  return (

    <div className="space-y-6">

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

  <div>

    <h2 className="text-2xl font-bold">
      Cleaning Actions
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Clean and transform your dataset with configurable operations.
    </p>

  </div>

  <div className="flex gap-3">

    <button
      onClick={handleUndo}
      disabled={restoring}
      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
    >
      ↶ Undo Last Action
    </button>

    <button
      onClick={handleRestoreOriginal}
      disabled={restoring}
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
    >
      ↻ Restore Original
    </button>

  </div>

</div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {/* Duplicate Handling */}

          <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">

              <CopyMinus
                  className="mb-4 text-orange-600"
                  size={30}
              />

              <h3 className="text-lg font-semibold">
                  Remove Duplicates
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                  Detect and remove duplicate records while preserving unique entries.
              </p>

              <button
                  onClick={() => run("duplicates")}
                  className="mt-6 rounded-lg bg-orange-600 px-5 py-2 text-white transition hover:bg-orange-700"
              >
                  Run
              </button>

          </div>

          {/* Missing Values */}

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">

              <FileWarning
                  className="mb-4 text-blue-600"
                  size={30}
              />

              <h3 className="text-lg font-semibold">
                  Fill Missing Values
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                  Configure column-wise strategies such as Mean, Median, Mode or Custom values.
              </p>

              <button
                onClick={() => setShowMissingModal(true)}
                className="mt-6 rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                >
                Configure
                </button>

          </div>


          {/* Text Cleaning */}

          <div className="rounded-xl border border-green-200 bg-green-50 p-6">

              <CaseSensitive
                  className="mb-4 text-green-600"
                  size={30}
              />

              <h3 className="text-lg font-semibold">
                  Normalize Text
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                  Trim spaces and standardize capitalization across text columns.
              </p>

              <button
                onClick={() => setShowNormalizeModal(true)}
                className="mt-6 rounded-lg bg-green-600 px-5 py-2 text-white transition hover:bg-green-700"
                >
                Configure
                </button>

          </div>

          {/* Outlier Detection */}

          <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">

              <ChartNoAxesCombined
                  className="mb-4 text-purple-600"
                  size={30}
              />

              <h3 className="text-lg font-semibold">
                  Detect Outliers
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                  Detect statistical outliers using the IQR method before removing them.
              </p>

              <button
                onClick={() => setShowOutlierModal(true)}
                className="mt-6 rounded-lg bg-purple-600 px-5 py-2 text-white transition hover:bg-purple-700"
                >
                Scan
                </button>

          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">

              <Columns3
                  className="mb-4 text-slate-600"
                  size={30}
              />

              <h3 className="text-lg font-semibold">
                  Remove Columns
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                  Select unnecessary or low-quality columns and remove them from the dataset.
              </p>

              <button
                    onClick={() => setShowRemoveColumnsModal(true)}
                    className="mt-6 rounded-lg bg-slate-700 px-5 py-2 text-white transition hover:bg-slate-800"
                >
                    Select
                </button>

          </div>

        </div>

        {result && (

          <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-5">

            <h3 className="mb-4 text-lg font-semibold text-green-700">
              Cleaning Results
            </h3>

            <div className="space-y-3 text-sm">

              <p>

                ✓ <span className="font-medium">Overall Score:</span>{" "}

                {result.before.overall}% → {result.after.overall}%

              </p>

              <p>

                ✓ <span className="font-medium">Missing Values:</span>{" "}

                {result.before.missing} → {result.after.missing}

              </p>

              <p>

                ✓ <span className="font-medium">Duplicate Rows:</span>{" "}

                {result.before.duplicates} → {result.after.duplicates}

              </p>

            </div>

          </div>

        )}

      </div>

      {showMissingModal && (
          <MissingValueModal
            datasetId={datasetId}
            profile={profile}
            onClose={() => setShowMissingModal(false)}
          />
      )}
      {showRemoveColumnsModal && (
        <RemoveColumnsModal
            datasetId={datasetId}
            profile={profile}
            onClose={() => setShowRemoveColumnsModal(false)}
        />
        )}

      {showOutlierModal && (
            <OutlierModal
                datasetId={datasetId}
                onClose={() => setShowOutlierModal(false)}
            />
            )}

       {showNormalizeModal && (
        <NormalizeTextModal
            datasetId={datasetId}
            profile={profile}
            onClose={() => setShowNormalizeModal(false)}
        />
        )}


    </div>

  );

}