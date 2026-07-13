import {
  LayoutDashboard,
  Upload,
  FileText,
  BarChart3,
  Settings,
  Database,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/upload",
    label: "Upload",
    icon: Upload,
  },
  {
    to: "/datasets",
    label: "Datasets",
    icon: FileText,
  },
  {
    to: "/reports",
    label: "Reports",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white/80 backdrop-blur-xl">

      <div className="flex items-center gap-3 border-b p-7">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Database size={24} />
        </div>

        <div>
          <h1 className="font-bold text-slate-900">
            DQI Platform
          </h1>

          <p className="text-xs text-slate-500">
            Data Quality Intelligence
          </p>
        </div>

      </div>

      <nav className="flex-1 space-y-2 p-5">

        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}

      </nav>

      <div className="border-t p-5">

        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100">

          <Settings size={18} />

          Settings

        </button>

      </div>

    </aside>
  );
}