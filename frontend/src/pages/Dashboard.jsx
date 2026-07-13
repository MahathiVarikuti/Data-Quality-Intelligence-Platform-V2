import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import DatasetTable from "../components/dashboard/DatasetTable";
import DatasetStatusChart from "../components/dashboard/DatasetStatusChart";

import { getDashboard } from "../api/dataset";

import {
  Database,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboard();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadDashboard();
  }, []);

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="mt-20 text-center">
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your datasets → upload, profile, clean and export
        </p>

      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Datasets"
          value={stats.totalDatasets}
          icon={Database}
        />

        <StatCard
          title="Cleaned"
          value={stats.cleaned}
          icon={ShieldCheck}
        />

        <StatCard
          title="Validated"
          value={stats.validated}
          icon={CheckCircle2}
        />

        <StatCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          icon={BarChart3}
        />

      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">

        <div className="lg:col-span-2">
          <DatasetTable />
        </div>

        <div className="h-full">
            <DatasetStatusChart
                data={stats.statusChart}
            />
        </div>

      </div>

    </DashboardLayout>
  );
}