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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <button
                onClick={() => run("duplicates")}
                className="rounded-xl bg-indigo-600 p-4 text-white"
            >
                Remove Duplicates
            </button>

            <button
                onClick={() => run("missing")}
                className="rounded-xl bg-indigo-600 p-4 text-white"
            >
                Fill Missing Values
            </button>

            <button
                onClick={() => run("normalize")}
                className="rounded-xl bg-indigo-600 p-4 text-white"
            >
                Normalize Text
            </button>

            <button
                onClick={() => run("outliers")}
                className="rounded-xl bg-indigo-600 p-4 text-white"
            >
                Remove Outliers
            </button>

        </div>

    );
}