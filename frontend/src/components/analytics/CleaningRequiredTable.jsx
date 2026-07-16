import { Link } from "react-router-dom";

export default function CleaningRequiredTable({ data }) {

  return (
    <div className="rounded-2xl border bg-white shadow-sm">

      <div className="border-b p-6">

        <h2 className="text-xl font-semibold">
          Cleaning Required
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Datasets with quality score below 60%
        </p>

      </div>

      {data.length === 0 ? (

        <div className="p-10 text-center">

            <div className="text-5xl">
                🎉
            </div>

            <h3 className="mt-4 text-lg font-semibold">
                All datasets meet the quality threshold
            </h3>

            <p className="mt-2 text-slate-500">
                No cleaning required.
            </p>

        </div>

      ) : (

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="p-4 text-left">
                Dataset
              </th>

              <th className="text-left">
                Score
              </th>

              <th className="text-left">
                Missing
              </th>

              <th className="text-left">
                Duplicates
              </th>

              <th></th>

            </tr>

          </thead>

          <tbody>

            {data.map((dataset) => (

              <tr
                key={dataset.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="p-4 font-medium">
                  {dataset.name}
                </td>

                <td>

                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">

                {dataset.score}%

                </span>

                </td>

                <td>{dataset.missing}</td>

                <td>{dataset.duplicates}</td>

                <td>

                  <Link
                    to={`/datasets/${dataset.id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    Open
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}