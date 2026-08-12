import { useNavigate, useLocation } from "react-router-dom";

const ITEMS = [
  { icon: "🏠", label: "Home", path: "/home" },
  { icon: "🔍", label: "Search", path: "/search" },
  { icon: "📋", label: "Bookings", path: "/bookings" },
  { icon: "💬", label: "Chat", path: "/chat" },
  { icon: "👤", label: "Profile", path: "/profile" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="bg-white border-t border-[#E5E7EB] h-[78px] w-full shrink-0 flex items-center justify-around px-2">
      {ITEMS.map((item) => {
        const active = pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1"
          >
            <span
              className={`text-[22px] leading-none ${active ? "" : "opacity-60"}`}
            >
              {item.icon}
            </span>
            <span
              className={`text-[12px] tracking-[0.2px] ${
                active ? "text-[#FF7A00] font-semibold" : "text-[#6B7280] font-medium"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
