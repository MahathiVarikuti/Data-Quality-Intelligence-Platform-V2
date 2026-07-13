import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import { getDataset, getProfile } from "../api/dataset";

import MetadataCard from "../components/dataset/MetadataCard";
import QualityScoreCard from "../components/dataset/QualityScoreCard";

import Tabs from "../components/ui/Tabs";

import ProfileSummary from "../components/profile/ProfileSummary";
import ColumnProfileTable from "../components/profile/ColumnProfileTable";
import PreviewTable from "../components/profile/PreviewTable";
import CleaningPanel from "../components/cleaning/CleaningPanel";

import {
  Database,
  FileText,
  Calendar,
  HardDrive,
  CheckCircle,
} from "lucide-react";

export default function DatasetDetails() {
  const { id } = useParams();

  const [dataset, setDataset] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDataset() {
      try {
        const datasetData = await getDataset(id);
        setDataset(datasetData);

        const profileData = await getProfile(id);
        setProfile(profileData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchDataset();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mt-20 text-center">
          Loading dataset...
        </div>
      </DashboardLayout>
    );
  }

  if (!dataset) {
    return (
      <DashboardLayout>
        <div className="mt-20 text-center">
          Dataset not found.
        </div>
      </DashboardLayout>
    );
  }

  const overviewContent = (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetadataCard
          icon={<Database size={22} />}
          title="Rows"
          value={dataset.num_rows}
        />

        <MetadataCard
          icon={<FileText size={22} />}
          title="Columns"
          value={dataset.num_columns}
        />

        <MetadataCard
          icon={<HardDrive size={22} />}
          title="File Size"
          value={
            dataset.file_size
              ? `${(dataset.file_size / 1024).toFixed(1)} KB`
              : "--"
          }
        />

        <MetadataCard
          icon={<Calendar size={22} />}
          title="Status"
          value={
            dataset.status
              ? dataset.status.charAt(0).toUpperCase() +
                dataset.status.slice(1)
              : "--"
          }
        />
      </div>

      <h2 className="mt-12 mb-6 text-2xl font-bold">
        Quality Scores
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <QualityScoreCard
          title="Completeness"
          score={dataset.report?.completeness_score ?? 0}
        />

        <QualityScoreCard
          title="Uniqueness"
          score={dataset.report?.uniqueness_score ?? 0}
        />

        <QualityScoreCard
          title="Validity"
          score={dataset.report?.validity_score ?? 0}
        />

        <QualityScoreCard
          title="Consistency"
          score={dataset.report?.consistency_score ?? 0}
        />

        <QualityScoreCard
          title="Overall"
          score={dataset.report?.overall_score ?? 0}
        />
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Issue Summary
          </h2>

          <ul className="space-y-3">
            {(dataset.report?.issue_summary ?? []).map((issue, index) => (
              <li
                key={index}
                className="flex items-center gap-2"
              >
                <CheckCircle
                  className="text-indigo-600"
                  size={18}
                />

                {issue}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Recommendations
          </h2>

          <ul className="space-y-3">
            {(dataset.report?.recommendations ?? []).map(
              (rec, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2"
                >
                  <CheckCircle
                    className="text-green-600"
                    size={18}
                  />

                  {rec}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </>
  );

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          {dataset.name}
        </h1>

        <p className="mt-2 text-slate-500">
          Dataset overview and quality report
        </p>
      </div>

      <Tabs
        tabs={[
          {
            label: "Overview",
            content: overviewContent,
          },

          {
            label: "Profiling",
            content: !profile ? (
              <div className="rounded-2xl border bg-white p-10 shadow-sm">
                Loading profile...
              </div>
            ) : (
              <>
                <ProfileSummary profile={profile} />

                <ColumnProfileTable
                  columns={profile.column_profile}
                />

                <PreviewTable
                  rows={profile.preview}
                />
              </>
            ),
          },

          {
            label: "Cleaning",
            content: (
              <CleaningPanel datasetId={dataset.id} />
            ),
          },

          {
            label: "Export",
            content: (
              <div className="rounded-2xl border bg-white p-10 shadow-sm">
                <h2 className="text-2xl font-bold">
                  Export the CSV
                </h2>
              </div>
            ),
          },
        ]}
      />
    </DashboardLayout>
  );
}