import { cleanDataset } from "../../api/dataset";

export default function CleaningPanel({ datasetId }) {

  async function run(action) {
    try {

      await cleanDataset(datasetId, action);

      alert("Cleaning completed.");

      window.location.reload();

    } catch (err) {

      console.error(err);

      alert("Cleaning failed.");

    }
  }

  return (

    <div className="space-y-6">

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-6 text-2xl font-bold">
          Cleaning Actions
        </h2>

        <div className="space-y-5">

          {/* Duplicate Handling */}

          <div className="rounded-lg border p-5">

            <h3 className="font-semibold text-lg">
              Duplicate Handling
            </h3>

            <p className="mt-1 mb-4 text-sm text-slate-500">
              Remove duplicate rows to improve dataset uniqueness.
            </p>

            <button
              onClick={() => run("duplicates")}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-white transition hover:bg-indigo-700"
            >
              Remove Duplicates
            </button>

          </div>

          {/* Missing Values */}

          <div className="rounded-lg border p-5">

            <h3 className="font-semibold text-lg">
              Missing Values
            </h3>

            <p className="mt-1 mb-4 text-sm text-slate-500">
              Fill missing values using the default strategy.
            </p>

            <button
              onClick={() => run("missing")}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-white transition hover:bg-indigo-700"
            >
              Fill Missing Values
            </button>

          </div>

          {/* Text Cleaning */}

          <div className="rounded-lg border p-5">

            <h3 className="font-semibold text-lg">
              Text Standardization
            </h3>

            <p className="mt-1 mb-4 text-sm text-slate-500">
              Normalize text formatting by trimming spaces and standardizing capitalization.
            </p>

            <button
              onClick={() => run("normalize")}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-white transition hover:bg-indigo-700"
            >
              Normalize Text
            </button>

          </div>

          {/* Outlier Detection */}

          <div className="rounded-lg border p-5">

            <h3 className="font-semibold text-lg">
              Outlier Detection
            </h3>

            <p className="mt-1 mb-4 text-sm text-slate-500">
              Detect and remove statistical outliers from numeric columns.
            </p>

            <button
              onClick={() => run("outliers")}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-white transition hover:bg-indigo-700"
            >
              Remove Outliers
            </button>

          </div>

        </div>

      </div>

    </div>

  );
}