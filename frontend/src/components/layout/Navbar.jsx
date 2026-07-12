import {
  Bell,
  Search,
  UserCircle,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-xl">

      {/* Left */}

      <div>

        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor your datasets and quality reports
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Search */}

        <div className="relative hidden lg:block">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search datasets..."
            className="w-72 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
          />

        </div>

        {/* Notification */}

        <button className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

          <Bell size={20} />

        </button>

        {/* Profile */}

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">

          <UserCircle
            size={28}
            className="text-indigo-600"
          />

          <div>

            <p className="text-sm font-semibold">
              Mahathi
            </p>

            <p className="text-xs text-slate-500">
              Data Analyst
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}