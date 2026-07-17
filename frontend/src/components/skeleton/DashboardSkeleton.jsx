import CardSkeleton from "./CardSkeleton";
import TableSkeleton from "./TableSkeleton";

export default function DashboardSkeleton() {

  return (

    <div className="animate-pulse">

      <div className="mb-10">

        <div className="h-10 w-56 rounded bg-slate-200"></div>

        <div className="mt-3 h-4 w-80 rounded bg-slate-200"></div>

      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />

      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">

        <div className="lg:col-span-2">
          <TableSkeleton />
        </div>

        <CardSkeleton />

      </div>

    </div>

  );

}