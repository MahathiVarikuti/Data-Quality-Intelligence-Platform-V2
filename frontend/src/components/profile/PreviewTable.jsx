export default function PreviewTable({ rows }) {

  if (!rows.length) return null;

  const headers = Object.keys(rows[0]);

  return (

    <div className="mt-8 overflow-x-auto rounded-2xl border bg-white shadow-sm">

      <table className="w-full text-sm">

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
                  className="p-3"
                >
                  {String(row[header])}
                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}