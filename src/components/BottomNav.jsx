import { useNavigate, useLocation } from "react-router-dom";

const CUSTOMER_ITEMS = [
  { icon: "🏠", label: "Home", path: "/home" },
  { icon: "🔍", label: "Search", path: "/search" },
  { icon: "📋", label: "Bookings", path: "/bookings" },
  { icon: "💬", label: "Chat", path: "/chat" },
  { icon: "👤", label: "Profile", path: "/profile" },
];

// Matches the artisan prototype's 5-item nav: Dashboard, Jobs, Chat, Profile, Settings
const ARTISAN_ITEMS = [
  { icon: "🏠", label: "Dashboard", path: "/artisan/dashboard" },
  { icon: "🧰", label: "Jobs", path: "/artisan/jobs" },
  { icon: "💬", label: "Chat", path: "/chat" },
  { icon: "👤", label: "Profile", path: "/artisan/profile" },
  { icon: "⚙️", label: "Settings", path: "/settings" },
];

export default function BottomNav({ role = "customer" }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const ITEMS = role === "artisan" ? ARTISAN_ITEMS : CUSTOMER_ITEMS;

  return (
    <div className="md:hidden bg-white border-t border-[#E5E7EB] h-[78px] w-full shrink-0 flex items-center justify-around px-1">
      {ITEMS.map((item) => {
        const active = pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-1 px-1"
          >
            <span className={`text-[20px] leading-none ${active ? "" : "opacity-60"}`}>
              {item.icon}
            </span>
            <span
              className={`text-[11px] tracking-[0.1px] ${
                active ? "text-[#1C4CD1] font-semibold" : "text-[#6B7280] font-medium"
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
