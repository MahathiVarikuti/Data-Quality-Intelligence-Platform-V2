import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  trend,
  icon: Icon,
}) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{
        duration: 0.2,
      }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
    >
      {/* Accent Line */}

      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-sky-500" />

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

        </div>

        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 p-4 text-white shadow-lg">
          <Icon size={24} />
        </div>

      </div>

      <div className="mt-6 flex items-center gap-2 text-sm">

        <ArrowUpRight
          size={16}
          className="text-emerald-600"
        />

        <span className="font-semibold text-emerald-600">
          {trend}
        </span>

        <span className="text-slate-400">
          since last analysis
        </span>

      </div>
    </motion.div>
  );
}