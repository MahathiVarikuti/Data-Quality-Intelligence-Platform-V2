import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import { getDashboard } from "../api/dataset";

import StatCard from "../components/dashboard/StatCard";
import DashboardSkeleton from "../components/skeleton/DashboardSkeleton";
import QualityDistributionChart from "../components/analytics/QualityDistributionChart";
import QualityRadarChart from "../components/analytics/QualityRadarChart";
import CleaningRequiredTable from "../components/analytics/CleaningRequiredTable";
import LatestAlerts from "../components/analytics/LatestAlerts";

import {
    Database,
    BarChart3,
    Rows3,
    HardDrive,
} from "lucide-react";

export default function Datasets() {

    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {

        async function load() {

            const data = await getDashboard();

            setAnalytics(data);

        }

        load();

    }, []);

    if (!analytics) {

        return (

            <DashboardLayout>

                <DashboardSkeleton />

            </DashboardLayout>

        );

    }

    return (

        <DashboardLayout>

            <div className="mb-10">

                <h1 className="text-4xl font-bold">
                    Dataset Analytics
                </h1>

                <p className="mt-2 text-slate-500">
                    Gain insights into dataset quality, health and cleaning priorities.
                </p>

            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Datasets"
                    value={analytics.totalDatasets}
                    icon={Database}
                />

                <StatCard
                    title="Average Score"
                    value={`${analytics.averageScore}%`}
                    icon={BarChart3}
                />

                <StatCard
                    title="Total Rows"
                    value={analytics.rowsProcessed}
                    icon={Rows3}
                />

                <StatCard
                    title="Storage"
                    value={`${analytics.storageUsed} MB`}
                    icon={HardDrive}
                />

            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">

                <QualityDistributionChart
                    data={analytics.qualityDistribution}
                />

                <QualityRadarChart
                    data={analytics.qualityRadar}
                />

            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-3">

                <div className="lg:col-span-2">

                    <CleaningRequiredTable
                        data={analytics.cleaningRequired}
                    />

                </div>

                <LatestAlerts
                    alerts={analytics.latestAlerts}
                />

            </div>

        </DashboardLayout>

    );

}