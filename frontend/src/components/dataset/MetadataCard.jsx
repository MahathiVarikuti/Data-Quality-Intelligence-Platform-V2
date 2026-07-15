export default function MetadataCard({
    icon,
    title,
    value,
}) {
    return (
        <div className="rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="mb-4 text-indigo-600">
                {icon}
            </div>

            <p className="text-sm text-slate-500">
                {title}
            </p>

            <h2 className="mt-2 text-2xl font-bold">
                {value}
            </h2>

        </div>
    );
}