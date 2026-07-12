import { useEffect, useState } from "react";

import { FileSpreadsheet } from "lucide-react";

import { getDatasets } from "../../api/dataset";
import { Link } from "react-router-dom";

export default function DatasetTable() {
    const [datasets, setDatasets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getDatasets();
                setDatasets(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);
    if (loading) {
        return (
            <div className="mt-8 rounded-2xl border bg-white p-10 text-center">
                Loading datasets...
            </div>
        );
    }
    return (
        <div className="mt-8 rounded-2xl border bg-white shadow-sm">

        <div className="flex items-center justify-between border-b p-6">

            <div>
            <h2 className="text-xl font-semibold">
                Recent Datasets
            </h2>

            <p className="mt-1 text-sm text-slate-500">
                Recently uploaded datasets
            </p>
            </div>

        </div>

        {datasets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">

            <FileSpreadsheet
                className="mb-4 text-slate-400"
                size={60}
            />

            <h3 className="text-xl font-semibold">
                No datasets uploaded
            </h3>

            <p className="mt-2 text-slate-500">
                Upload your first CSV dataset to begin analysis.
            </p>

            </div>
        ) : (
            <table className="w-full">
                <thead className="border-b bg-slate-50">
                    <tr>
                    <th className="p-4 text-left">Dataset</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Rows</th>
                    <th className="text-left">Uploaded</th>
                    </tr>
                </thead>

                <tbody>
                    {datasets.map((dataset) => (
                    <tr
                        key={dataset.id}
                        className="border-b hover:bg-slate-50"
                    >
                        <td className="p-4 font-medium">
                            <Link
                                to={`/datasets/${dataset.id}`}
                                className="text-indigo-600 hover:underline"
                            >
                                {dataset.name}
                            </Link>
                        </td>

                        <td>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                            {dataset.status}
                        </span>
                        </td>

                        <td>
                        {dataset.num_rows ?? "--"}
                        </td>

                        <td>
                        {new Date(dataset.uploaded_at).toLocaleDateString()}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
        )}

        </div>
    );
}