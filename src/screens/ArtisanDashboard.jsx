import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Card, VerifiedBadge } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import { Table, THead, TRow, TCell } from "../components/DesktopExtras";
import { Avatar as MobileAvatar } from "../components/UI";
import { newRequests } from "../data/mockData";

export default function ArtisanDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(newRequests);

  const respond = (id) => setRequests((r) => r.filter((req) => req.id !== id));

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
                <p className="text-[#1F2937] text-xl font-bold">Ifeanyi Obi</p>
                <VerifiedBadge />
              </div>
            </div>
            <button onClick={() => navigate("/notifications")} className="relative text-2xl text-[#1F2937]">🔔</button>
          </div>
          <div className="flex gap-3 px-6 pt-5">
            <Card className="flex-1 flex flex-col gap-1">
              <p className="text-[#6B7280] text-xs font-medium">Pending</p>
              <p className="text-[#1F2937] text-2xl font-bold">{requests.length}</p>
            </Card>
            <Card className="flex-1 flex flex-col gap-1">
              <p className="text-[#6B7280] text-xs font-medium">This Month</p>
              <p className="text-[#1F2937] text-2xl font-bold">₦84K</p>
            </Card>
          </div>
          <div className="px-6 pt-6 pb-4 flex flex-col gap-2.5">
            <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px]">NEW BOOKING REQUESTS</p>
            {requests.length === 0 && <p className="text-[#6B7280] text-sm text-center pt-6">No new requests right now.</p>}
            {requests.map((r) => (
              <Card key={r.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-[#1F2937] text-sm font-semibold">{r.customer}</p>
                  <span className="text-[#6B7280] text-xs">{r.time}</span>
                </div>
                <p className="text-[#6B7280] text-sm">{r.detail}</p>
                <div className="flex gap-3">
                  <button onClick={() => respond(r.id)} className="flex-1 h-11 rounded-[10px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold">Decline</button>
                  <button onClick={() => { respond(r.id); navigate("/artisan/jobs"); }} className="flex-1 h-11 rounded-[10px] bg-[#FF7A00] text-white text-sm font-semibold">Accept</button>
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
                <h1 className="text-[#1F2937] text-[28px] font-bold">Welcome back, Ifeanyi 👋</h1>
                <p className="text-[#6B7280] text-base mt-1">Here&apos;s how your business is doing.</p>
              </div>
              <VerifiedBadge />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <Card className="flex flex-col items-center gap-1 py-6">
                <p className="text-[#1F2937] text-3xl font-bold">{requests.length + 11}</p>
                <p className="text-[#6B7280] text-sm">Pending Requests</p>
              </Card>
              <Card className="flex flex-col items-center gap-1 py-6">
                <p className="text-[#1F2937] text-3xl font-bold">₦84,000</p>
                <p className="text-[#6B7280] text-sm">Earnings This Month</p>
              </Card>
              <Card className="flex flex-col items-center gap-1 py-6">
                <p className="text-[#1F2937] text-3xl font-bold">4.9 ★</p>
                <p className="text-[#6B7280] text-sm">Average Rating</p>
              </Card>
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
                <TRow>
                  <TCell className="w-[280px] flex items-center gap-3">
                    <MobileAvatar size={32} />
                    <span className="text-[#1F2937] text-sm font-medium">Chukwudi Divine</span>
                  </TCell>
                  <TCell className="w-[260px] text-[#1F2937] text-sm">Rewire kitchen sockets</TCell>
                  <TCell className="w-[170px] text-[#1F2937] text-sm">Thu, 2:00 PM</TCell>
                  <TCell className="w-[170px] text-[#1F2937] text-sm">Lekki Phase 1</TCell>
                  <TCell className="flex-1 flex gap-3 justify-end">
                    <button className="h-9 px-4 rounded-[8px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold">Decline</button>
                    <button onClick={() => navigate("/artisan/jobs")} className="h-9 px-4 rounded-[8px] bg-[#FF7A00] text-white text-sm font-semibold">Accept</button>
                  </TCell>
                </TRow>
                <TRow>
                  <TCell className="w-[280px] flex items-center gap-3">
                    <MobileAvatar size={32} />
                    <span className="text-[#1F2937] text-sm font-medium">Amaka O.</span>
                  </TCell>
                  <TCell className="w-[260px] text-[#1F2937] text-sm">Fix tripping breaker</TCell>
                  <TCell className="w-[170px] text-[#1F2937] text-sm">Fri, 11:00 AM</TCell>
                  <TCell className="w-[170px] text-[#1F2937] text-sm">Ikoyi</TCell>
                  <TCell className="flex-1 flex gap-3 justify-end">
                    <button className="h-9 px-4 rounded-[8px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold">Decline</button>
                    <button onClick={() => navigate("/artisan/jobs")} className="h-9 px-4 rounded-[8px] bg-[#FF7A00] text-white text-sm font-semibold">Accept</button>
                  </TCell>
                </TRow>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
