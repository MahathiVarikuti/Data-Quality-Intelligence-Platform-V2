export default function QualityScoreCard({
    title,
    score,
}) {

    let color = "";

    let bg = "";

    let icon = "";

    if (score >= 90) {

        color = "text-green-600";
        bg = "border-green-200 bg-green-50";
        icon = "🟢";

    }

    else if (score >= 75) {

        color = "text-amber-500";
        bg = "border-amber-200 bg-amber-50";
        icon = "🟠";

    }

    else {

        color = "text-red-600";
        bg = "border-red-200 bg-red-50";
        icon = "🔴";

    }

    return (

        <div
            className={`rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${bg}`}
        >

            <p className="text-sm text-slate-600">
                {title}
            </p>

            <div className="mt-4 flex items-center gap-3">

                <span className="text-2xl">
                    {icon}
                </span>

                <h2
                    className={`text-4xl font-bold ${color}`}
                >
                    {score}%
                </h2>

            </div>

        </div>

    );

}