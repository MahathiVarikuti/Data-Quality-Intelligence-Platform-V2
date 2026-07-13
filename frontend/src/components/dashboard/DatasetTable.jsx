import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileSpreadsheet, Search, Trash2, ExternalLink } from "lucide-react";

import { getDatasets } from "../../api/dataset";

export default function DatasetTable() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDatasets();

        data.sort(
          (a, b) =>
            new Date(b.uploaded_at) -
            new Date(a.uploaded_at)
        );

        setDatasets(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredDatasets = useMemo(() => {
    return datasets
      .filter((dataset) =>
        dataset.name
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .slice(0, 5);
  }, [datasets, search]);

  function badge(status) {
    switch (status) {
      case "validated":
        return "bg-green-100 text-green-700";

      case "cleaned":
        return "bg-purple-100 text-purple-700";

      case "profiled":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  if (loading) {
    return (
      <div className="mt-8 rounded-2xl border bg-white p-10 text-center">
        Loading datasets...
      </div>
    );
  }

  return (
    <div className="mt-1 rounded-2xl border bg-white shadow-sm">

      <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">

        <div>

          <h2 className="text-xl font-semibold">
            Recent Datasets
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Recently uploaded or modified datasets
          </p>

        </div>

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search datasets..."
            className="rounded-lg border py-2 pl-10 pr-4 outline-none focus:border-indigo-500"
          />

        </div>

      </div>

      {filteredDatasets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">

          <FileSpreadsheet
            className="mb-4 text-slate-400"
            size={60}
          />

          <h3 className="text-xl font-semibold">
            No datasets found
          </h3>

          <p className="mt-2 text-slate-500">
            Upload your first CSV dataset to begin analysis.
          </p>

        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="border-b bg-slate-50">

              <tr>

                <th className="p-4 text-left">Name</th>

                <th className="text-left">Rows</th>

                <th className="text-left">Columns</th>

                <th className="text-left">Status</th>

                <th className="text-left">Uploaded</th>

                <th></th>

                <th></th>

              </tr>

            </thead>

            <tbody>

              {filteredDatasets.map((dataset) => (

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

                  <td>{dataset.num_rows ?? "--"}</td>

                  <td>{dataset.num_columns ?? "--"}</td>

                  <td>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${badge(dataset.status)}`}
                    >
                      {dataset.status}
                    </span>

                  </td>

                  <td>

                    {new Intl.DateTimeFormat(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    ).format(
                      new Date(dataset.uploaded_at)
                    )}

                  </td>

                  <td>

                    <Link
                      to={`/datasets/${dataset.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-slate-100"
                    >
                      <ExternalLink size={16} />
                      Open
                    </Link>

                  </td>

                  <td>

                    <button
                      className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}