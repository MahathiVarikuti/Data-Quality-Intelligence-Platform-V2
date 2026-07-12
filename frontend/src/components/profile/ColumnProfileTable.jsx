export default function ColumnProfileTable({ columns }) {
  return (
    <div className="mt-8 overflow-x-auto rounded-2xl border bg-white shadow-sm">

      <table className="w-full text-sm">

        <thead className="bg-slate-50">
          <tr>
            <th className="p-4 text-left">Column</th>
            <th className="text-left">Type</th>
            <th className="text-left">Missing</th>
            <th className="text-left">Unique</th>
            <th className="text-left">Mean</th>
            <th className="text-left">Median</th>
            <th className="text-left">Min</th>
            <th className="text-left">Max</th>
            <th className="text-left">Top Values</th>
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

              <td>{col.type}</td>

              <td>{col.missing}</td>

              <td>{col.unique}</td>

              <td>{col.mean ?? "--"}</td>

              <td>{col.median ?? "--"}</td>

              <td>{col.min ?? "--"}</td>

              <td>{col.max ?? "--"}</td>

              <td>

                {col.top_values
                  ? col.top_values.join(", ")
                  : "--"}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}