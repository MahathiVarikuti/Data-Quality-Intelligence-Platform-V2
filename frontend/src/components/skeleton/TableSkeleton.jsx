export default function TableSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6 h-6 w-48 rounded bg-slate-200"></div>

      {[1,2,3,4,5].map((row) => (

        <div
          key={row}
          className="mb-4 flex gap-4"
        >

          <div className="h-5 flex-1 rounded bg-slate-200"></div>

          <div className="h-5 w-24 rounded bg-slate-200"></div>

          <div className="h-5 w-24 rounded bg-slate-200"></div>

          <div className="h-5 w-24 rounded bg-slate-200"></div>

        </div>

      ))}

    </div>
  );
}