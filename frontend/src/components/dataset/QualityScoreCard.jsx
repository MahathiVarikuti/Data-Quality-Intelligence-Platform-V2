export default function QualityScoreCard({
    title,
    score,
}) {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <p className="text-sm text-slate-500">
                {title}
            </p>

            <h2 className="mt-4 text-4xl font-bold text-indigo-600">
                {score}%
            </h2>

        </div>
    );
}