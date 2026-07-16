export default function LatestAlerts({ alerts }) {

  const colors = {
    critical: "border-red-200 bg-red-50",
    warning: "border-amber-200 bg-amber-50",
    info: "border-blue-200 bg-blue-50",
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Latest Alerts
      </h2>

      <div className="space-y-4">

        {alerts.length === 0 ? (

          <div className="py-10 text-center">

                <div className="text-5xl">
                    🎉
                </div>

                <h3 className="mt-4 text-lg font-semibold">
                    Everything looks healthy
                </h3>

                <p className="mt-2 text-slate-500">
                    No alerts detected.
                </p>

            </div>

        ) : (

          alerts.map((alert, index) => (

            <div
              key={index}
              className={`rounded-xl border p-4 ${colors[alert.severity]}`}
            >
              <span className="mr-2">

                {alert.severity === "critical"
                    ? "🔴"
                    : alert.severity === "warning"
                    ? "🟠"
                    : "🔵"}

                </span>
              <h3 className="font-semibold">
                {alert.dataset}
              </h3>

              <p className="mt-1 text-sm">
                {alert.message}
              </p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}