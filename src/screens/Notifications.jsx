import { useNavigate } from "react-router-dom";
import { StatusSpace } from "../components/UI";

const NOTIFICATIONS = [
  { icon: "🔔", text: "You get new job o! Customer dey wait for your reply", time: "10m ago" },
  { icon: "⏰", text: "E don set! Bimpe don accept your job, she go soon reach you.", time: "2h ago" },
  { icon: "🩹", text: "No forget your artisan go land by 10:00am today.", time: "3h ago" },
  { icon: "💰", text: "Money don release to Tunde since job don complete well well.", time: "Yesterday" },
  { icon: "🎧", text: "Your customer dey wait for you to come work for him.", time: "2 days ago" },
  { icon: "💵", text: "Mr Abdullah sent you ₦16,000 for the job you did for him.", time: "5 days ago" },
];

export default function Notifications() {
  const navigate = useNavigate();

  return (
    <div className="bg-white flex flex-col h-full w-full">
      <StatusSpace />
      <div className="flex items-center gap-3 px-6 pt-2 pb-4">
        <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">
          ‹
        </button>
        <h1 className="text-[#1F2937] text-2xl font-bold">Notification</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-3 pb-6">
        {NOTIFICATIONS.map((n, i) => (
          <div
            key={i}
            className="flex gap-3 items-start border border-[#E5E7EB] rounded-2xl p-4"
          >
            <div className="size-12 rounded-xl bg-[#F5F6F8] flex items-center justify-center text-xl shrink-0">
              {n.icon}
            </div>
            <div className="flex-1">
              <p className="text-[#1F2937] text-sm">{n.text}</p>
              <p className="text-[#9CA3AF] text-xs mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
