import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, TogglePill, Avatar } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import { Table, THead, TRow, TCell, StatusPill } from "../components/DesktopExtras";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { myBookings as mockBookings } from "../data/mockData";

const statusStyle = { accepted: "text-[#22C55E]", pending: "text-[#FF7A00]", completed: "text-[#6B7280]", declined: "text-[#EF4444]", cancelled: "text-[#EF4444]" };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function MyBookings() {
  const navigate = useNavigate();
  const { token, isAuthed } = useAuth();
  const [tab, setTab] = useState("Upcoming");
  const [bookings, setBookings] = useState(null); // null = not loaded yet

  useEffect(() => {
    if (!isAuthed) return;
    api.myBookings(token).then((res) => setBookings(res.bookings)).catch(() => setBookings([]));
  }, [isAuthed, token]);

  const live = bookings !== null;
  const upcoming = live ? bookings.filter((b) => ["pending", "accepted"].includes(b.status)) : mockBookings.upcoming;
  const completed = live ? bookings.filter((b) => ["completed", "declined", "cancelled"].includes(b.status)) : mockBookings.completed;
  const list = tab === "Upcoming" ? upcoming : completed;

  // A "completed" booking (artisan marked the job done) still needs the
  // customer to pay before it's fully closed out — that's what routes into
  // the Payment screen. Accepted/pending bookings go to their confirmation
  // details instead.
  const detailsPath = (b) => {
    const status = live ? b.status : b.status.toLowerCase();
    if (status === "completed") {
      return `/payment?bookingId=${b.id}&artisanId=${b.artisanId || ""}&artisanName=${encodeURIComponent(live ? b.artisanName : b.name)}`;
    }
    return "/booking-confirmation";
  };
  const actionLabel = (b) => {
    const status = live ? b.status : b.status.toLowerCase();
    return status === "completed" ? "Pay Now →" : "Details →";
  };

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col overflow-y-auto px-6 pt-4 gap-5">
          <h1 className="text-[#1F2937] text-2xl font-bold">My Bookings</h1>
          {!isAuthed && (
            <p className="text-[#6B7280] text-sm border border-[#E5E7EB] rounded-xl p-3">
              <button onClick={() => navigate("/login")} className="text-[#1C4CD1] font-semibold">Log in</button> to see your real bookings. Showing sample data for now.
            </p>
          )}
          <TogglePill options={["Upcoming", "Completed"]} active={tab} onChange={setTab} />
          <div className="flex flex-col gap-3">
            {list.length === 0 && <p className="text-[#6B7280] text-sm text-center pt-8">No bookings here yet.</p>}
            {list.map((b) => (
              <button key={b.id} onClick={() => navigate(detailsPath(b))} className="border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[#1F2937] text-sm font-semibold">{live ? `${b.artisanName} — ${b.artisanTrade}` : b.name}</span>
                  <span className={`text-sm font-semibold ${statusStyle[live ? b.status : b.status.toLowerCase()]}`}>
                    {live ? cap(b.status) : b.status}
                  </span>
                </div>
                <span className="text-[#6B7280] text-sm">{live ? `${b.date} ${b.time} · ${b.location}` : b.time}</span>
                <span className="text-[#1C4CD1] text-sm font-semibold self-end">{actionLabel(b)}</span>
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
            <div className="flex items-center justify-between">
              <h1 className="text-[#1F2937] text-2xl font-bold">My Bookings</h1>
              {!isAuthed && (
                <button onClick={() => navigate("/login")} className="text-[#1C4CD1] text-sm font-semibold">Log in to see real bookings</button>
              )}
            </div>
            <TogglePill options={["Upcoming", "Completed"]} active={tab} onChange={setTab} />
            <Table>
              <THead
                columns={[
                  { label: "Artisan", className: "w-[240px]" },
                  { label: "Trade", className: "w-[150px]" },
                  { label: "Date", className: "w-[170px]" },
                  { label: "Status", className: "w-[130px]" },
                  { label: "", className: "flex-1" },
                ]}
              />
              {list.length === 0 && <div className="text-[#6B7280] text-sm text-center py-8">No bookings here yet.</div>}
              {list.map((b) => (
                <TRow key={b.id}>
                  <TCell className="w-[240px] flex items-center gap-3">
                    <Avatar size={32} />
                    <span className="text-[#1F2937] text-sm font-medium">{live ? b.artisanName : b.name}</span>
                  </TCell>
                  <TCell className="w-[150px] text-[#1F2937] text-sm">{live ? b.artisanTrade : "Electrician"}</TCell>
                  <TCell className="w-[170px] text-[#1F2937] text-sm">{live ? `${b.date} · ${b.time}` : b.time}</TCell>
                  <TCell className="w-[130px]"><StatusPill status={live ? cap(b.status) : b.status} /></TCell>
                  <TCell className="flex-1">
                    <button onClick={() => navigate(detailsPath(b))} className="text-[#1C4CD1] text-sm font-semibold">{actionLabel(b)}</button>
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
