import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Card } from "../components/UI";
import BottomNav from "../components/BottomNav";
import { artisanJobs } from "../data/mockData";

const TABS = ["Pending", "Accepted", "Completed"];

export default function ArtisanJobs() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Accepted");
  const [jobs, setJobs] = useState(artisanJobs);

  const markComplete = (id) => {
    setJobs((prev) => {
      const job = prev.accepted.find((j) => j.id === id);
      if (!job) return prev;
      return {
        ...prev,
        accepted: prev.accepted.filter((j) => j.id !== id),
        completed: [{ ...job, amount: "₦16,250" }, ...prev.completed],
      };
    });
    setTab("Completed");
  };

  const list = jobs[tab.toLowerCase()];

  return (
    <div className="bg-white flex flex-col h-full w-full">
      <StatusSpace />
      <div className="flex-1 overflow-y-auto px-6 pt-2 flex flex-col gap-4">
        <h1 className="text-[#1F2937] text-2xl font-bold">Jobs</h1>

        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 h-[33px] rounded-full text-sm font-medium whitespace-nowrap transition ${
                tab === t ? "bg-[#0F2A44] text-white" : "bg-[#F5F6F8] text-[#6B7280]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 pb-4">
          {list.length === 0 && (
            <p className="text-[#6B7280] text-sm text-center pt-8">No jobs here yet.</p>
          )}
          {list.map((j) => (
            <Card key={j.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[#1F2937] text-sm font-semibold">{j.customer}</p>
                <span className="text-[#6B7280] text-xs">{j.time}</span>
              </div>
              <p className="text-[#6B7280] text-sm">{j.detail}</p>

              {tab === "Accepted" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/chat")}
                    className="flex-1 h-11 rounded-[10px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold"
                  >
                    💬 Message
                  </button>
                  <button
                    onClick={() => markComplete(j.id)}
                    className="flex-1 h-11 rounded-[10px] bg-[#FF7A00] text-white text-sm font-semibold"
                  >
                    Mark Complete
                  </button>
                </div>
              )}
              {tab === "Completed" && (
                <div className="flex items-center justify-between bg-[#F5F6F8] rounded-xl px-4 h-11">
                  <span className="text-[#6B7280] text-sm">Paid</span>
                  <span className="text-[#1F2937] text-sm font-semibold">{j.amount}</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
      <BottomNav role="artisan" />
    </div>
  );
}
