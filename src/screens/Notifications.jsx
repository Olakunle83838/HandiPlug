import { useNavigate } from "react-router-dom";
import { StatusSpace } from "../components/UI";
import TopNav from "../components/TopNav";

const TODAY = [
  { icon: "✓", text: "Booking accepted", body: "Ifeanyi Obi accepted your electrician booking for Thursday, 2:00 PM.", time: "2h ago" },
  { icon: "💬", text: "New message", body: 'Ifeanyi Obi: "Great — can you come by 2pm on Thursday?"', time: "3h ago" },
];
const EARLIER = [
  { icon: "🕑", text: "Appointment reminder", body: "Don't forget — your plumber is scheduled to arrive tomorrow at 9:00 AM.", time: "1d ago" },
  { icon: "₦", text: "Payment released", body: "Payment has been released to Musa Sani following job completion.", time: "3d ago" },
  { icon: "⭐", text: "Job marked complete", body: "Your job has been marked complete. Please rate your experience.", time: "3d ago" },
];

function NotifRow({ n }) {
  return (
    <div className="flex gap-3 items-start border border-[#E5E7EB] rounded-2xl p-4">
      <div className="size-10 rounded-xl bg-[#F5F6F8] flex items-center justify-center text-lg shrink-0">{n.icon}</div>
      <div className="flex-1">
        <p className="text-[#1F2937] text-sm font-semibold">{n.text}</p>
        <p className="text-[#6B7280] text-sm mt-0.5">{n.body}</p>
      </div>
      <span className="text-[#9CA3AF] text-xs shrink-0">{n.time}</span>
    </div>
  );
}

export default function Notifications() {
  const navigate = useNavigate();

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center gap-3 px-6 pt-2 pb-4">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
          <h1 className="text-[#1F2937] text-2xl font-bold">Notification</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-3 pb-6">
          {[...TODAY, ...EARLIER].map((n, i) => (
            <div key={i} className="flex gap-3 items-start border border-[#E5E7EB] rounded-2xl p-4">
              <div className="size-12 rounded-xl bg-[#F5F6F8] flex items-center justify-center text-xl shrink-0">{n.icon}</div>
              <div className="flex-1">
                <p className="text-[#1F2937] text-sm">{n.text}</p>
                <p className="text-[#9CA3AF] text-xs mt-1">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" />
        <div className="flex-1 overflow-y-auto px-12 py-8">
          <div className="max-w-[720px] mx-auto flex flex-col gap-5">
            <h1 className="text-[#1F2937] text-2xl font-bold">Notifications</h1>
            <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px]">TODAY</p>
            <div className="flex flex-col gap-3">
              {TODAY.map((n, i) => <NotifRow key={i} n={n} />)}
            </div>
            <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px] mt-2">EARLIER</p>
            <div className="flex flex-col gap-3">
              {EARLIER.map((n, i) => <NotifRow key={i} n={n} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
