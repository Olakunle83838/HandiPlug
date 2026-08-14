import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Card, VerifiedBadge } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import { Table, THead, TRow, TCell } from "../components/DesktopExtras";
import { Avatar as MobileAvatar } from "../components/UI";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { newRequests as mockRequests } from "../data/mockData";

export default function ArtisanDashboard() {
  const navigate = useNavigate();
  const { token, user, isAuthed } = useAuth();
  const [bookings, setBookings] = useState(null);
  const [busy, setBusy] = useState(null);
  const [boosted, setBoosted] = useState(false);

  const load = () => {
    if (!isAuthed) return;
    api.myBookings(token).then((res) => setBookings(res.bookings)).catch(() => setBookings([]));
  };
  useEffect(load, [isAuthed, token]);

  const live = bookings !== null;
  const pending = live ? bookings.filter((b) => b.status === "pending") : mockRequests.map((r) => ({ id: r.id, customerName: r.customer, time: r.time, detail: r.detail }));

  const respond = async (id, status) => {
    if (!live) return; // demo mode, no backend to call
    setBusy(id);
    try {
      await api.updateBooking(id, status, token);
      load();
      if (status === "accepted") navigate("/artisan/jobs");
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="px-6 pt-2 flex items-center justify-between">
            <div>
              <p className="text-[#6B7280] text-sm">Welcome back 👋</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[#1F2937] text-xl font-bold">{user?.fullName || "Ifeanyi Obi"}</p>
                {(user?.verified ?? true) && <VerifiedBadge />}
              </div>
            </div>
            <button onClick={() => navigate("/notifications")} className="relative text-2xl text-[#1F2937]">🔔</button>
          </div>
          <div className="flex gap-3 px-6 pt-5">
            <Card className="flex-1 flex flex-col gap-1">
              <p className="text-[#6B7280] text-xs font-medium">Pending</p>
              <p className="text-[#1F2937] text-2xl font-bold">{pending.length}</p>
            </Card>
            <Card className="flex-1 flex flex-col gap-1">
              <p className="text-[#6B7280] text-xs font-medium">This Month</p>
              <p className="text-[#1F2937] text-2xl font-bold">₦84K</p>
            </Card>
          </div>
          <div className="px-6 pt-5 flex flex-col gap-3">
            <div className="bg-[#0F2A44] rounded-[20px] p-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-white text-sm font-bold">⭐ Go Verified Pro</p>
                <p className="text-white/70 text-xs mt-1">
                  ₦5,000/mo · priority in job feed · 0% commission on first 2 jobs
                </p>
              </div>
              <button className="bg-[#FF7A00] text-white text-xs font-semibold rounded-[8px] px-3 py-2 shrink-0">
                Upgrade
              </button>
            </div>
            <div className="border border-[#E5E7EB] rounded-[20px] p-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[#1F2937] text-sm font-bold">🚀 Boost Your Profile</p>
                <p className="text-[#6B7280] text-xs mt-1">₦500 · appear first in search for 24 hours</p>
              </div>
              <button onClick={() => setBoosted(true)} disabled={boosted} className="bg-[#0F2A44] text-white text-xs font-semibold rounded-[8px] px-3 py-2 shrink-0 disabled:opacity-50">
                {boosted ? "Boosted ✓" : "Boost"}
              </button>
            </div>
          </div>

          <div className="px-6 pt-6 pb-4 flex flex-col gap-2.5">
            <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px]">NEW BOOKING REQUESTS</p>
            {pending.length === 0 && <p className="text-[#6B7280] text-sm text-center pt-6">No new requests right now.</p>}
            {pending.map((r) => (
              <Card key={r.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-[#1F2937] text-sm font-semibold">{r.customerName}</p>
                  <span className="text-[#6B7280] text-xs">{r.time}</span>
                </div>
                <p className="text-[#6B7280] text-sm">{r.detail}</p>
                <div className="flex gap-3">
                  <button disabled={busy === r.id} onClick={() => respond(r.id, "declined")} className="flex-1 h-11 rounded-[10px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold disabled:opacity-50">Decline</button>
                  <button disabled={busy === r.id} onClick={() => respond(r.id, "accepted")} className="flex-1 h-11 rounded-[10px] bg-[#FF7A00] text-white text-sm font-semibold disabled:opacity-50">Accept</button>
                </div>
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
          <div className="max-w-[1300px] mx-auto flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[#1F2937] text-[28px] font-bold">Welcome back, {(user?.fullName || "Ifeanyi").split(" ")[0]} 👋</h1>
                <p className="text-[#6B7280] text-base mt-1">Here&apos;s how your business is doing.</p>
              </div>
              {(user?.verified ?? true) && <VerifiedBadge />}
            </div>

            <div className="grid grid-cols-3 gap-6">
              <Card className="flex flex-col items-center gap-1 py-6">
                <p className="text-[#1F2937] text-3xl font-bold">{pending.length}</p>
                <p className="text-[#6B7280] text-sm">Pending Requests</p>
              </Card>
              <Card className="flex flex-col items-center gap-1 py-6">
                <p className="text-[#1F2937] text-3xl font-bold">₦84,000</p>
                <p className="text-[#6B7280] text-sm">Earnings This Month</p>
              </Card>
              <Card className="flex flex-col items-center gap-1 py-6">
                <p className="text-[#1F2937] text-3xl font-bold">{user?.rating || "4.9"} ★</p>
                <p className="text-[#6B7280] text-sm">Average Rating</p>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0F2A44] rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-white text-base font-bold">⭐ Go Verified Pro — ₦5,000/mo</p>
                  <p className="text-white/70 text-sm mt-1">
                    Priority placement, Verified Pro badge, 0% commission on first 2 jobs.
                  </p>
                </div>
                <button className="bg-[#FF7A00] text-white text-sm font-semibold rounded-[10px] px-5 py-2.5 shrink-0">
                  Upgrade
                </button>
              </div>
              <div className="border border-[#E5E7EB] rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-[#1F2937] text-base font-bold">🚀 Boost Your Profile — ₦500</p>
                  <p className="text-[#6B7280] text-sm mt-1">Appear first in search results for 24 hours.</p>
                </div>
                <button onClick={() => setBoosted(true)} disabled={boosted} className="bg-[#0F2A44] text-white text-sm font-semibold rounded-[10px] px-5 py-2.5 shrink-0 disabled:opacity-50">
                  {boosted ? "Boosted ✓" : "Boost"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px]">NEW BOOKING REQUESTS</p>
              <Table>
                <THead
                  columns={[
                    { label: "Customer", className: "w-[280px]" },
                    { label: "Job", className: "w-[260px]" },
                    { label: "Date & Time", className: "w-[170px]" },
                    { label: "Location", className: "w-[170px]" },
                    { label: "", className: "flex-1" },
                  ]}
                />
                {pending.length === 0 && <div className="text-[#6B7280] text-sm text-center py-8">No new requests right now.</div>}
                {pending.map((r) => (
                  <TRow key={r.id}>
                    <TCell className="w-[280px] flex items-center gap-3">
                      <MobileAvatar size={32} />
                      <span className="text-[#1F2937] text-sm font-medium">{r.customerName}</span>
                    </TCell>
                    <TCell className="w-[260px] text-[#1F2937] text-sm">{r.detail}</TCell>
                    <TCell className="w-[170px] text-[#1F2937] text-sm">{r.date} {r.time}</TCell>
                    <TCell className="w-[170px] text-[#1F2937] text-sm">{r.location || "—"}</TCell>
                    <TCell className="flex-1 flex gap-3 justify-end">
                      <button disabled={busy === r.id} onClick={() => respond(r.id, "declined")} className="h-9 px-4 rounded-[8px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold disabled:opacity-50">Decline</button>
                      <button disabled={busy === r.id} onClick={() => respond(r.id, "accepted")} className="h-9 px-4 rounded-[8px] bg-[#FF7A00] text-white text-sm font-semibold disabled:opacity-50">Accept</button>
                    </TCell>
                  </TRow>
                ))}
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
