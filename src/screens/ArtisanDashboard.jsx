import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Card, VerifiedBadge, Button } from "../components/UI";
import BottomNav from "../components/BottomNav";
import { newRequests } from "../data/mockData";

export default function ArtisanDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(newRequests);

  const respond = (id) => setRequests((r) => r.filter((req) => req.id !== id));

  return (
    <div className="bg-white flex flex-col h-full w-full">
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
          <button
            onClick={() => navigate("/notifications")}
            className="relative text-2xl text-[#1F2937]"
          >
            🔔
          </button>
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
          <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px]">
            NEW BOOKING REQUESTS
          </p>
          {requests.length === 0 && (
            <p className="text-[#6B7280] text-sm text-center pt-6">
              No new requests right now.
            </p>
          )}
          {requests.map((r) => (
            <Card key={r.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[#1F2937] text-sm font-semibold">{r.customer}</p>
                <span className="text-[#6B7280] text-xs">{r.time}</span>
              </div>
              <p className="text-[#6B7280] text-sm">{r.detail}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => respond(r.id)}
                  className="flex-1 h-11 rounded-[10px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold"
                >
                  Decline
                </button>
                <button
                  onClick={() => {
                    respond(r.id);
                    navigate("/artisan/jobs");
                  }}
                  className="flex-1 h-11 rounded-[10px] bg-[#FF7A00] text-white text-sm font-semibold"
                >
                  Accept
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <BottomNav role="artisan" />
    </div>
  );
}
