import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import DatasetTable from "../components/dashboard/DatasetTable";
import QualityTrendChart from "../components/dashboard/QualityTrendChart";
import DatasetStatusChart from "../components/dashboard/DatasetStatusChart";

import {
  Database,
  ShieldCheck,
  Rows3,
  BarChart3,
} from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout>

      <div className="mb-12">

        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
          Welcome back
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor, analyze and improve your datasets with AI-powered quality insights.
        </p>

      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Datasets"
          value="0"
          trend="+0%"
          icon={Database}
        />

        <StatCard
          title="Quality Reports"
          value="0"
          trend="+0%"
          icon={ShieldCheck}
        />

        <StatCard
          title="Rows Processed"
          value="0"
          trend="+0%"
          icon={Rows3}
        />

        <StatCard
          title="Average Score"
          value="--"
          trend="+0%"
          icon={BarChart3}
        />

      </div>
      <div className="mt-10">
        <DatasetTable />
      </div>

    </DashboardLayout>
  );
}