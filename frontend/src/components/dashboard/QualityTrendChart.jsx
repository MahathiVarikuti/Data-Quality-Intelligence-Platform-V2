import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Mon", score: 78 },
  { name: "Tue", score: 82 },
  { name: "Wed", score: 88 },
  { name: "Thu", score: 84 },
  { name: "Fri", score: 91 },
  { name: "Sat", score: 94 },
];

export default function QualityTrendChart() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Quality Trend
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="4 4" />

          <XAxis dataKey="name" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#4f46e5"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}