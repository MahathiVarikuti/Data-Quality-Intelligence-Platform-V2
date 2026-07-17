import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="relative flex min-h-screen bg-slate-50">

      {/* Background image */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: "url('/wireframe-bg.png')",
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
          backgroundRepeat: "repeat-y",
          opacity: 0.04,
        }}
      />

      <Sidebar />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Navbar />

        <main className="flex-1 min-w-0 overflow-hidden p-8">
          {children}
        </main>
      </div>

    </div>
  );
}