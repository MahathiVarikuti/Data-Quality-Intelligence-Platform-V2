export default function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border bg-white p-6 shadow-sm">
      <div className="h-4 w-24 rounded bg-slate-200"></div>

      <div className="mt-6 h-10 w-20 rounded bg-slate-200"></div>
    </div>
  );
}