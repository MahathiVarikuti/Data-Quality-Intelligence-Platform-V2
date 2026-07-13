import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";

const COLORS = {
  uploaded: "#94a3b8",
  profiled: "#3b82f6",
  validated: "#22c55e",
  cleaned: "#8b5cf6",
};

export default function DatasetStatusChart({ data = [] }) {
  const chartData = data.map((item) => ({
    name:
      item.status.charAt(0).toUpperCase() +
      item.status.slice(1),
    value: item.count,
    color: COLORS[item.status] || "#64748b",
  }));
  const total = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-lg font-semibold">
        Dataset Status Overview
      </h2>

      <ResponsiveContainer
        width="100%"
        height={340}
      >
        <PieChart>

          <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={75}
              outerRadius={115}
              paddingAngle={2}
              stroke="none"
          >
              {chartData.map((entry, index) => (
                  <Cell
                      key={index}
                      fill={entry.color}
                  />
              ))}
              <Label
                value={total}
                position="center"
                className="fill-slate-900 text-3xl font-bold"
              />
          </Pie>

          <Legend
              verticalAlign="bottom"
              align="center"
              iconType="rect"
              wrapperStyle={{
                  paddingTop: 20,
                  fontSize: 14,
              }}
          />

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}