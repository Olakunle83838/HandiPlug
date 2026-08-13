import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, TogglePill, Avatar } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import { Table, THead, TRow, TCell, StatusPill } from "../components/DesktopExtras";
import { myBookings } from "../data/mockData";

const statusStyle = { Accepted: "text-[#22C55E]", Pending: "text-[#FF7A00]", Completed: "text-[#6B7280]" };

const desktopRows = [
  { id: 1, name: "Ifeanyi Obi", trade: "Electrician", time: "Thu, 2:00 PM", location: "Lekki Phase 1", status: "Accepted", action: "Message" },
  { id: 2, name: "Tunde Bakare", trade: "Carpenter", time: "Fri, 10:00 AM", location: "Ikeja GRA", status: "Pending", action: "Message" },
  { id: 3, name: "Musa Sani", trade: "Plumber", time: "Aug 1, 9:00 AM", location: "Yaba", status: "Completed", action: "Leave a Review" },
];

export default function MyBookings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("Upcoming");
  const list = tab === "Upcoming" ? myBookings.upcoming : myBookings.completed;

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col overflow-y-auto px-6 pt-4 gap-5">
          <h1 className="text-[#1F2937] text-2xl font-bold">My Bookings</h1>
          <TogglePill options={["Upcoming", "Completed"]} active={tab} onChange={setTab} />
          <div className="flex flex-col gap-3">
            {list.length === 0 && <p className="text-[#6B7280] text-sm text-center pt-8">No bookings here yet.</p>}
            {list.map((b) => (
              <button key={b.id} onClick={() => navigate("/booking-confirmation")} className="border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[#1F2937] text-sm font-semibold">{b.name}</span>
                  <span className={`text-sm font-semibold ${statusStyle[b.status]}`}>{b.status}</span>
                </div>
                <span className="text-[#6B7280] text-sm">{b.time}</span>
              </button>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" />
        <div className="flex-1 overflow-y-auto px-12 py-8">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-5">
            <h1 className="text-[#1F2937] text-2xl font-bold">My Bookings</h1>
            <TogglePill options={["Upcoming", "Completed", "Cancelled"]} active="Upcoming" onChange={() => {}} />
            <Table>
              <THead
                columns={[
                  { label: "Artisan", className: "w-[260px]" },
                  { label: "Trade", className: "w-[160px]" },
                  { label: "Date & Time", className: "w-[180px]" },
                  { label: "Location", className: "w-[180px]" },
                  { label: "Status", className: "w-[140px]" },
                  { label: "", className: "flex-1" },
                ]}
              />
              {desktopRows.map((r) => (
                <TRow key={r.id}>
                  <TCell className="w-[260px] flex items-center gap-3">
                    <Avatar size={32} />
                    <span className="text-[#1F2937] text-sm font-medium">{r.name}</span>
                  </TCell>
                  <TCell className="w-[160px] text-[#1F2937] text-sm">{r.trade}</TCell>
                  <TCell className="w-[180px] text-[#1F2937] text-sm">{r.time}</TCell>
                  <TCell className="w-[180px] text-[#1F2937] text-sm">{r.location}</TCell>
                  <TCell className="w-[140px]"><StatusPill status={r.status} /></TCell>
                  <TCell className="flex-1">
                    <button onClick={() => navigate("/chat")} className="text-[#FF7A00] text-sm font-semibold">
                      {r.action}
                    </button>
                  </TCell>
                </TRow>
              ))}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
