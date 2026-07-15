export default function PreviewTable({ rows }) {

  if (!rows.length) return null;

  const headers = Object.keys(rows[0]);

  return (

    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-900 bg-white shadow-sm">

    <h2 className="border-b bg-slate-50 p-5 text-xl font-semibold">
        Preview (First 5 Rows)
    </h2>

    <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm">

        <thead className="bg-slate-50">

          <tr>

            {headers.map((header) => (

              <th
                key={header}
                className="p-3 text-left"
              >
                {header}
              </th>

            ))}

          </tr>

        </thead>

        <tbody>

          {rows.map((row, index) => (

            <tr
              key={index}
              className="border-t"
            >

              {headers.map((header) => (

                <td
                  key={header}
                  className="max-w-[180px] truncate p-3"
                  title={String(row[header])}
                >
                    {String(row[header])}
                </td>

              ))}

            </tr>

          ))}

        </tbody>


        </table>

    </div>

</div>

  );
}





      