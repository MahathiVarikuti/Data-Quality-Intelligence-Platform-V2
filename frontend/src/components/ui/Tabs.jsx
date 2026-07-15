import { useState } from "react";

export default function Tabs({ tabs }) {
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="mb-8 flex gap-2 border-b">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => setActive(index)}
            className={`rounded-t-lg px-5 py-3 font-medium transition ${
              active === index
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-slate-500 hover:text-indigo-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-w-0 overflow-hidden">
          {tabs[active].content}
      </div>
    </>
  );
}