import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, TogglePill } from "../components/UI";
import BottomNav from "../components/BottomNav";
import { myBookings } from "../data/mockData";

const statusStyle = {
  Accepted: "text-[#22C55E]",
  Pending: "text-[#FF7A00]",
  Completed: "text-[#6B7280]",
};

export default function MyBookings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Upcoming");
  const list = tab === "Upcoming" ? myBookings.upcoming : myBookings.completed;

  return (
    <div className="bg-white flex flex-col h-full w-full">
      <StatusSpace />
      <div className="flex-1 flex flex-col overflow-y-auto px-6 pt-4 gap-5">
        <h1 className="text-[#1F2937] text-2xl font-bold">My Bookings</h1>
        <TogglePill options={["Upcoming", "Completed"]} active={tab} onChange={setTab} />

        <div className="flex flex-col gap-3">
          {list.length === 0 && (
            <p className="text-[#6B7280] text-sm text-center pt-8">No bookings here yet.</p>
          )}
          {list.map((b) => (
            <button
              key={b.id}
              onClick={() => navigate("/booking-confirmation")}
              className="border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-2 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#1F2937] text-sm font-semibold">{b.name}</span>
                <span className={`text-sm font-semibold ${statusStyle[b.status]}`}>
                  {b.status}
                </span>
              </div>
              <span className="text-[#6B7280] text-sm">{b.time}</span>
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
