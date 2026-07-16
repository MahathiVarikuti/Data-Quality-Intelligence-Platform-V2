import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function QualityRadarChart({ data }) {

  const chartData = [
    {
      metric: "Completeness",
      value: data.completeness,
    },
    {
      metric: "Uniqueness",
      value: data.uniqueness,
    },
    {
      metric: "Validity",
      value: data.validity,
    },
    {
      metric: "Consistency",
      value: data.consistency,
    },
  ];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Dataset Quality Radar
      </h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <RadarChart data={chartData}>

          <PolarGrid />

          <PolarAngleAxis dataKey="metric" />

          <PolarRadiusAxis
            domain={[0, 100]}
          />

          <Radar
                dataKey="value"
                stroke="#4f46e5"
                strokeWidth={3}
                fill="#6366f1"
                fillOpacity={0.35}
          />

        </RadarChart>
      </ResponsiveContainer>

    </div>
  );
}