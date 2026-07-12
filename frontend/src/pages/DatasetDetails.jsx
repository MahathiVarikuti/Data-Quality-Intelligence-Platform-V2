import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import { getDataset } from "../api/dataset";
import MetadataCard from "../components/dataset/MetadataCard";
import QualityScoreCard from "../components/dataset/QualityScoreCard";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDataset() {
      try {
        const data = await getDataset(id);
        setDataset(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDataset();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center mt-20">
          Loading dataset...
        </div>
      </DashboardLayout>
    );
  }

  if (!dataset) {
    return (
      <DashboardLayout>
        <div className="text-center mt-20">
          Dataset not found.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      {/* Header */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          {dataset.name}
        </h1>

        <p className="mt-2 text-slate-500">
          Dataset overview and quality report
        </p>

      </div>

      {/* Metadata */}

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
          value={`${(dataset.file_size / 1024).toFixed(1)} KB`}
        />

        <MetadataCard
          icon={<Calendar size={22} />}
          title="Status"
          value={dataset.status}
        />

      </div>

      {/* Quality */}

      <h2 className="mt-12 mb-6 text-2xl font-bold">
        Quality Scores
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

        <QualityScoreCard
          title="Completeness"
          score={dataset.report.completeness_score}
        />

        <QualityScoreCard
          title="Uniqueness"
          score={dataset.report.uniqueness_score}
        />

        <QualityScoreCard
          title="Validity"
          score={dataset.report.validity_score}
        />

        <QualityScoreCard
          title="Consistency"
          score={dataset.report.consistency_score}
        />

        <QualityScoreCard
          title="Overall"
          score={dataset.report.overall_score}
        />

      </div>

      {/* Issues */}

      <div className="mt-12 grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="mb-4 text-xl font-semibold">
            Issue Summary
          </h2>

          <ul className="space-y-3">

            {dataset.report.issue_summary.map((issue, index) => (
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

            {dataset.report.recommendations.map((rec, index) => (
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
            ))}

          </ul>

        </div>

      </div>

    </DashboardLayout>
  );
}

function MetadataCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-4 text-indigo-600">
        {icon}
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        {value}
      </h2>

    </div>
  );
}

function QualityScoreCard({ title, score }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm text-center">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h2 className="mt-4 text-4xl font-bold text-indigo-600">
        {score}%
      </h2>

    </div>
  );
}