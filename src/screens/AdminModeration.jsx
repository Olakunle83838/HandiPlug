import { useState } from "react";
import { StatusSpace, Card, Avatar } from "../components/UI";
import { adminStats, verificationQueue } from "../data/mockData";

export default function AdminModeration() {
  const [tab, setTab] = useState("Verification Queue");
  const [queue, setQueue] = useState(verificationQueue);

  const resolve = (id) => setQueue((q) => q.filter((item) => item.id !== id));

  return (
    <div className="bg-white flex flex-col h-full w-full">
      <StatusSpace />
      <div className="flex-1 overflow-y-auto px-6 pt-2 flex flex-col gap-5 pb-6">
        <h1 className="text-[#1F2937] text-2xl font-bold">Admin — Moderation</h1>

        <div className="flex gap-3">
          {adminStats.map((s) => (
            <Card key={s.label} className="flex-1 flex flex-col gap-1">
              <p className="text-[#6B7280] text-xs font-medium">{s.label}</p>
              <p className="text-[#1F2937] text-2xl font-bold">{s.value}</p>
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
          {["Verification Queue", "Flagged Content"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 h-8 rounded-full text-sm font-medium whitespace-nowrap ${
                tab === t ? "bg-[#0F2A44] text-white" : "bg-[#F5F6F8] text-[#6B7280]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Verification Queue" ? (
          <div className="flex flex-col gap-3">
            {queue.length === 0 && (
              <p className="text-[#6B7280] text-sm text-center pt-8">Queue is clear ✅</p>
            )}
            {queue.map((item) => (
              <Card key={item.id} className="flex gap-3">
                <Avatar size={48} />
                <div className="flex-1 flex flex-col gap-2">
                  <div>
                    <p className="text-[#1F2937] text-sm font-semibold">{item.name}</p>
                    <p className="text-[#6B7280] text-xs">
                      {item.trade} · {item.submitted}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button className="text-[#0F2A44] text-xs font-semibold underline">
                      View ID
                    </button>
                    <button className="text-[#0F2A44] text-xs font-semibold underline">
                      View selfie match
                    </button>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => resolve(item.id)}
                      className="flex-1 h-9 rounded-[8px] bg-[#22C55E] text-white text-xs font-semibold"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => resolve(item.id)}
                      className="flex-1 h-9 rounded-[8px] border border-[#E5E7EB] text-[#1F2937] text-xs font-semibold"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-[#6B7280] text-sm text-center pt-8">No flagged content 🎉</p>
        )}
      </div>
    </div>
  );
}
