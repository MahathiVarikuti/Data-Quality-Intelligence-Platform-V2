export default function ColumnProfileTable({ columns }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border bg-white shadow-sm">

      <h2 className="border-b bg-slate-50 p-5 text-xl font-semibold">
          Column Profiling
      </h2>
      <div className="max-h-[400px] overflow-auto p-0">
      <table className="w-full table-auto text-sm">

        <thead className="sticky top-0 z-10 bg-slate-50">
          <tr>
            <th className="w-10 p-4 text-left">Column</th>
            <th className="w-22 text-left">Type</th>
            <th className="w-24 text-left">Missing</th>
            <th className="w-24 text-left">Unique</th>
            <th className="w-28 text-left">Mean</th>
            <th className="w-28 text-left">Median</th>
            <th className="w-24 text-left">Min</th>
            <th className="w-24 text-left">Max</th>
            <th className="w-64 text-left">Top Values</th>
          </tr>
        </thead>

        <tbody>

          {columns.map((col) => (

            <tr
              key={col.name}
              className="border-t hover:bg-slate-50"
            >

              <td className="p-4 font-medium">
                {col.name}
              </td>

              <td className="max-w-[140px] break-all px-4 py-3">
                  {col.type}
              </td>

              <td className="max-w-[140px] break-all px-4 py-3">
                  {col.missing}
              </td>

              <td className="max-w-[140px] break-all px-4 py-3">
                  {col.unique}
              </td>

              <td className="max-w-[140px] break-all px-4 py-3">
                  {col.mean ?? "--"}
              </td>

              <td className="max-w-[140px] break-all px-4 py-3">
                  {col.median ?? "--"}
              </td>

              <td className="max-w-[140px] break-all px-4 py-3">
                  {col.min ?? "--"}
              </td>

              <td className="max-w-[140px] break-all px-4 py-3">
                  {col.max ?? "--"}
              </td>

              <td
                  className="max-w-[220px] break-all px-4 py-3"
              >
                  {col.top_values
                      ? col.top_values.join(", ")
                      : "--"}
              </td>

            </tr>

          ))}

        </tbody>

      </table>
      </div>

    </div>
  );
}