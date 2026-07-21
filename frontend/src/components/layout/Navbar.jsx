import {
  UserCircle,
} from "lucide-react";

export default function Navbar() {
  const username =
    localStorage.getItem("username") || "User";
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-xl">

      {/* Left */}

      <div>

        <h1 className="text-2xl font-bold text-slate-900">
          Data Quality Intelligence Platform
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Spend less time fixing data and more time discovering insights
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Search */}

        

        {/* Notification */}

        

        {/* Profile */}

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">

          <UserCircle
            size={28}
            className="text-indigo-600"
          />

          <div>

            <p className="text-sm font-semibold">
              {username}
            </p>


          </div>

        </div>

      </div>

    </header>
  );
}