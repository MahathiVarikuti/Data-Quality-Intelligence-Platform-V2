import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.01,
      }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg"
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h2>

        </div>

        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Icon size={22} />
        </div>

      </div>
    </motion.div>
  );
}