import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
];

export default function QualityDistributionChart({ data }) {
  const chartData = [
    {
      category: "Excellent",
      count: data.excellent,
    },
    {
      category: "Good",
      count: data.good,
    },
    {
      category: "Fair",
      count: data.fair,
    },
    {
      category: "Poor",
      count: data.poor,
    },
  ];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Quality Distribution
      </h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <BarChart data={chartData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="category" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
                label={{ position: "top" }}
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}