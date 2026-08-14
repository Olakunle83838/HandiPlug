import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Card } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import { Table, THead, TRow, TCell, StatusPill } from "../components/DesktopExtras";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { artisanJobs as mockJobs } from "../data/mockData";

const TABS = ["Pending", "Accepted", "Completed"];
const pillFor = { Pending: "Pending", Accepted: "Accepted", Completed: "Completed" };

export default function ArtisanJobs() {
  const navigate = useNavigate();
  const { token, isAuthed } = useAuth();
  const [tab, setTab] = useState("Accepted");
  const [bookings, setBookings] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = () => {
    if (!isAuthed) return;
    api.myBookings(token).then((res) => setBookings(res.bookings)).catch(() => setBookings([]));
  };
  useEffect(load, [isAuthed, token]);

  const live = bookings !== null;

  const jobsByTab = live
    ? {
        pending: bookings.filter((b) => b.status === "pending").map((b) => ({ id: b.id, customer: b.customerName, time: `${b.date} ${b.time}`, detail: b.detail })),
        accepted: bookings.filter((b) => b.status === "accepted").map((b) => ({ id: b.id, customer: b.customerName, time: `${b.date} ${b.time}`, detail: b.detail })),
        completed: bookings.filter((b) => b.status === "completed").map((b) => ({ id: b.id, customer: b.customerName, time: `${b.date} ${b.time}`, detail: b.detail, amount: "—" })),
      }
    : mockJobs;

  const markComplete = async (id) => {
    if (!live) return;
    setBusy(id);
    try {
      await api.updateBooking(id, "completed", token);
      load();
      setTab("Completed");
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  const list = jobsByTab[tab.toLowerCase()];

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 overflow-y-auto px-6 pt-2 flex flex-col gap-4">
          <h1 className="text-[#1F2937] text-2xl font-bold">Jobs</h1>
          <div className="flex gap-2">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 h-[33px] rounded-full text-sm font-medium whitespace-nowrap transition ${tab === t ? "bg-[#0F2A44] text-white" : "bg-[#F5F6F8] text-[#6B7280]"}`}>{t}</button>
            ))}
          </div>
          <div className="flex flex-col gap-3 pb-4">
            {list.length === 0 && <p className="text-[#6B7280] text-sm text-center pt-8">No jobs here yet.</p>}
            {list.map((j) => (
              <Card key={j.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-[#1F2937] text-sm font-semibold">{j.customer}</p>
                  <span className="text-[#6B7280] text-xs">{j.time}</span>
                </div>
                <p className="text-[#6B7280] text-sm">{j.detail}</p>
                {tab === "Accepted" && (
                  <div className="flex gap-3">
                    <button onClick={() => navigate("/chat")} className="flex-1 h-11 rounded-[10px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold">💬 Message</button>
                    <button disabled={busy === j.id} onClick={() => markComplete(j.id)} className="flex-1 h-11 rounded-[10px] bg-[#FF7A00] text-white text-sm font-semibold disabled:opacity-50">Mark Complete</button>
                  </div>
                )}
                {tab === "Completed" && (
                  <div className="flex items-center justify-between bg-[#F5F6F8] rounded-xl px-4 h-11">
                    <span className="text-[#6B7280] text-sm">Status</span>
                    <span className="text-[#1F2937] text-sm font-semibold">{j.amount}</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
        <BottomNav role="artisan" />
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="artisan" />
        <div className="flex-1 overflow-y-auto px-12 py-8">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-5">
            <h1 className="text-[#1F2937] text-2xl font-bold">Jobs</h1>
            <div className="flex gap-2">
              {TABS.map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`px-4 h-8 rounded-full text-sm font-medium whitespace-nowrap ${tab === t ? "bg-[#0F2A44] text-white" : "bg-[#F5F6F8] text-[#6B7280]"}`}>{t}</button>
              ))}
            </div>
            <Table>
              <THead
                columns={[
                  { label: "Customer", className: "w-[240px]" },
                  { label: "Job", className: "w-[260px]" },
                  { label: "Date & Time", className: "w-[180px]" },
                  { label: "Status", className: "w-[140px]" },
                  { label: "", className: "flex-1" },
                ]}
              />
              {list.length === 0 && <div className="text-[#6B7280] text-sm text-center py-8">No jobs here yet.</div>}
              {list.map((j) => (
                <TRow key={j.id}>
                  <TCell className="w-[240px] text-[#1F2937] text-sm font-medium">{j.customer}</TCell>
                  <TCell className="w-[260px] text-[#1F2937] text-sm">{j.detail}</TCell>
                  <TCell className="w-[180px] text-[#1F2937] text-sm">{j.time}</TCell>
                  <TCell className="w-[140px]"><StatusPill status={pillFor[tab]} /></TCell>
                  <TCell className="flex-1 flex gap-3 justify-end">
                    {tab === "Accepted" && (
                      <>
                        <button onClick={() => navigate("/chat")} className="h-9 px-4 rounded-[8px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold">Message</button>
                        <button disabled={busy === j.id} onClick={() => markComplete(j.id)} className="h-9 px-4 rounded-[8px] bg-[#FF7A00] text-white text-sm font-semibold disabled:opacity-50">Mark Complete</button>
                      </>
                    )}
                    {tab === "Completed" && <span className="text-[#1F2937] text-sm font-semibold">{j.amount}</span>}
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
