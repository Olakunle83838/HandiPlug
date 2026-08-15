import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Card, VerifiedBadge } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import { Avatar as MobileAvatar } from "../components/UI";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { newRequests as mockRequests, upcomingSchedule } from "../data/mockData";

const WEEK_BARS = [40, 55, 25, 60, 75, 45, 65]; // relative heights for the "This week" mini chart

export default function ArtisanDashboard() {
  const navigate = useNavigate();
  const { token, user, isAuthed } = useAuth();
  const [bookings, setBookings] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = () => {
    if (!isAuthed) return;
    api.myBookings(token).then((res) => setBookings(res.bookings)).catch(() => setBookings([]));
  };
  useEffect(load, [isAuthed, token]);

  const live = bookings !== null;
  const pending = live
    ? bookings.filter((b) => b.status === "pending")
    : mockRequests.map((r) => ({ id: r.id, customerName: r.customer, time: r.time, detail: r.detail, location: r.location }));

  const respond = async (id, status) => {
    if (!live) return;
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

  const firstName = (user?.fullName || "Bimpe").split(" ")[0];

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="bg-[#1C4CD1] px-6 pt-2 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Welcome back,</p>
                <p className="text-white text-xl font-bold">{user?.fullName || "Bimpe Okafor"}</p>
              </div>
              <span className="bg-white text-[#15803D] text-xs font-semibold rounded-full px-3 py-1.5 flex items-center gap-1">
                🛡️ Verified Pro
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-white/15 rounded-xl p-3">
                <p className="text-white text-base font-bold">₦86,200</p>
                <p className="text-white/70 text-xs">Earnings</p>
              </div>
              <div className="bg-white/15 rounded-xl p-3">
                <p className="text-white text-base font-bold">{user?.rating || "4.9"}★</p>
                <p className="text-white/70 text-xs">Rating</p>
              </div>
              <div className="bg-white/15 rounded-xl p-3">
                <p className="text-white text-base font-bold">{user?.reviewCount || 140}</p>
                <p className="text-white/70 text-xs">Jobs</p>
              </div>
            </div>
          </div>

          <div className="px-6 pt-5 flex flex-col gap-2.5">
            <p className="text-[#1F2937] text-sm font-bold">New requests</p>
            {pending.length === 0 && <p className="text-[#6B7280] text-sm">No new requests right now.</p>}
            {pending.map((r) => (
              <Card key={r.id} className="flex flex-col gap-3">
                <p className="text-[#1F2937] text-sm font-semibold">{r.customerName}</p>
                <p className="text-[#6B7280] text-sm">{r.detail}</p>
                <p className="text-[#9CA3AF] text-xs">📅 {r.time} {r.location && `· 📍 ${r.location}`}</p>
                <div className="flex gap-2">
                  <button disabled={busy === r.id} onClick={() => respond(r.id, "accepted")} className="flex-1 h-9 rounded-[8px] bg-[#DCFCE7] text-[#15803D] text-xs font-semibold disabled:opacity-50">👍 Accept</button>
                  <button className="flex-1 h-9 rounded-[8px] bg-[#F5F6F8] text-[#1F2937] text-xs font-semibold">Reschedule</button>
                  <button disabled={busy === r.id} onClick={() => respond(r.id, "declined")} className="flex-1 h-9 rounded-[8px] bg-[#FEE2E2] text-[#DC2626] text-xs font-semibold disabled:opacity-50">👎 Decline</button>
                </div>
              </Card>
            ))}
          </div>

          <div className="px-6 pt-6 pb-4 flex flex-col gap-2.5">
            <p className="text-[#1F2937] text-sm font-bold">Upcoming schedule</p>
            {upcomingSchedule.map((s) => (
              <Card key={s.id} className="flex items-center justify-between">
                <div>
                  <p className="text-[#1F2937] text-sm font-semibold">{s.title}</p>
                  <p className="text-[#6B7280] text-sm">{s.time}</p>
                </div>
                <span className="bg-[#EEF2FF] text-[#1C4CD1] text-xs font-semibold rounded-full px-3 py-1.5">{s.status}</span>
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
          <div className="max-w-[1300px] mx-auto flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[#1F2937] text-[26px] font-bold">Welcome back, {firstName}</h1>
                <p className="text-[#6B7280] text-base mt-1">Here's what's happening today.</p>
              </div>
              <span className="bg-[#DCFCE7] text-[#15803D] text-sm font-semibold rounded-full px-4 py-2 flex items-center gap-1.5">
                🛡️ Verified Pro
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Card className="flex flex-col gap-1">
                <span className="text-[#1C4CD1]">💰</span>
                <p className="text-[#1F2937] text-xl font-bold">₦86,200</p>
                <p className="text-[#6B7280] text-sm">Earnings</p>
              </Card>
              <Card className="flex flex-col gap-1">
                <span className="text-[#1C4CD1]">⭐</span>
                <p className="text-[#1F2937] text-xl font-bold">{user?.rating || "4.9"} ★</p>
                <p className="text-[#6B7280] text-sm">Rating</p>
              </Card>
              <Card className="flex flex-col gap-1">
                <span className="text-[#1C4CD1]">💼</span>
                <p className="text-[#1F2937] text-xl font-bold">{user?.reviewCount || 140}</p>
                <p className="text-[#6B7280] text-sm">Jobs done</p>
              </Card>
              <Card className="flex flex-col gap-1">
                <span className="text-[#1C4CD1]">🕑</span>
                <p className="text-[#1F2937] text-xl font-bold">{pending.length}</p>
                <p className="text-[#6B7280] text-sm">Pending</p>
              </Card>
            </div>

            <div className="grid grid-cols-3 gap-6 items-start">
              <div className="col-span-2 flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <p className="text-[#1F2937] text-base font-bold">New requests</p>
                  {pending.length === 0 && <p className="text-[#6B7280] text-sm">No new requests right now.</p>}
                  {pending.map((r) => (
                    <div key={r.id} className="border border-[#E5E7EB] rounded-2xl p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <MobileAvatar size={44} />
                        <div>
                          <p className="text-[#1F2937] text-sm font-semibold">{r.customerName}</p>
                          <p className="text-[#6B7280] text-sm">{r.detail}</p>
                          <p className="text-[#9CA3AF] text-xs mt-0.5">📅 {r.time} {r.location && `· 📍 ${r.location}`}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button disabled={busy === r.id} onClick={() => respond(r.id, "accepted")} className="h-9 px-4 rounded-[8px] bg-[#DCFCE7] text-[#15803D] text-sm font-semibold disabled:opacity-50">👍 Accept</button>
                        <button className="h-9 px-4 rounded-[8px] bg-[#F5F6F8] text-[#1F2937] text-sm font-semibold">Reschedule</button>
                        <button disabled={busy === r.id} onClick={() => respond(r.id, "declined")} className="h-9 px-4 rounded-[8px] bg-[#FEE2E2] text-[#DC2626] text-sm font-semibold disabled:opacity-50">👎 Decline</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-[#1F2937] text-base font-bold">Upcoming schedule</p>
                  {upcomingSchedule.map((s) => (
                    <div key={s.id} className="border border-[#E5E7EB] rounded-2xl p-5 flex items-center justify-between">
                      <div>
                        <p className="text-[#1F2937] text-sm font-semibold">{s.title}</p>
                        <p className="text-[#6B7280] text-sm">{s.time}</p>
                      </div>
                      <span className="bg-[#EEF2FF] text-[#1C4CD1] text-xs font-semibold rounded-full px-3 py-1.5">{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="border border-[#E5E7EB] rounded-2xl p-5">
                  <p className="text-[#1F2937] text-sm font-bold mb-3">📊 This week</p>
                  <div className="flex items-end gap-2 h-[90px]">
                    {WEEK_BARS.map((h, i) => (
                      <div key={i} className="flex-1 bg-[#1C4CD1] rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="border border-[#E5E7EB] rounded-2xl p-5">
                  <p className="text-[#1F2937] text-sm font-bold mb-2">Profile completeness</p>
                  <div className="h-2 bg-[#F5F6F8] rounded-full overflow-hidden">
                    <div className="h-full bg-[#22C55E] rounded-full" style={{ width: "80%" }} />
                  </div>
                  <p className="text-[#6B7280] text-xs mt-2">Add 2 more portfolio photos to reach 100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
