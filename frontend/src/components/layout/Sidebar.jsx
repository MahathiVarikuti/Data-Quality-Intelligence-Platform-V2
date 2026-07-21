import {
  LayoutDashboard,
  Upload,
  FileText,
  Database,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/auth";


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
  
];

export default function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };
  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-shrink-0 flex-col border-r border-slate-200 bg-white/80 backdrop-blur-xl">

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

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 hover:bg-red-50 transition-all"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>
  );
}