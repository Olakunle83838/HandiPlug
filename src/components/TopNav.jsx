import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

// Matches the desktop prototype exactly: "Home | Find artisans | My bookings
// | Messages" for customers, "Dashboard | Messages | My profile" for artisans.
const CUSTOMER_LINKS = [
  { label: "Home", path: "/home" },
  { label: "Find artisans", path: "/search" },
  { label: "My bookings", path: "/bookings" },
  { label: "Messages", path: "/chat" },
];

const ARTISAN_LINKS = [
  { label: "Dashboard", path: "/artisan/dashboard" },
  { label: "Jobs", path: "/artisan/jobs" },
  { label: "Messages", path: "/chat" },
  { label: "My profile", path: "/artisan/profile" },
];

function initials(name) {
  if (!name) return "AU";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "AU";
}

/**
 * Desktop top navigation bar. Hidden on mobile (md:flex) — mobile screens
 * keep their existing StatusSpace/back-arrow header + BottomNav pattern.
 * variant: "guest" | "app" | "artisan" | "admin"
 */
export default function TopNav({
  variant = "app",
  search,
  onSearchChange,
  searchPlaceholder = "Search electricians, plumbers...",
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  const NavLink = ({ link }) => {
    const active = pathname === link.path;
    return (
      <button
        key={link.path}
        onClick={() => navigate(link.path)}
        className={`text-sm font-medium transition whitespace-nowrap ${
          active ? "text-[#1C4CD1] font-semibold" : "text-[#1F2937] hover:text-[#1C4CD1]"
        }`}
      >
        {link.label}
      </button>
    );
  };

  const profilePath = variant === "artisan" ? "/artisan/profile" : "/profile";

  return (
    <div className="hidden md:flex items-center justify-between h-[72px] px-6 lg:px-12 border-b border-[#E5E7EB] w-full shrink-0 gap-4 lg:gap-6">
      <button onClick={() => navigate(variant === "guest" ? "/splash" : "/home")} className="shrink-0 flex items-center gap-2">
        <Logo size={30} variant="icon" />
        <span className="font-extrabold text-lg text-[#1C4CD1]">HandiPlug</span>
      </button>

      {variant === "guest" && (
        <>
          <nav className="flex items-center gap-8">
            <button onClick={() => navigate("/splash")} className="text-[#1F2937] text-sm font-medium">Home</button>
            <button onClick={() => navigate("/search")} className="text-[#1F2937] text-sm font-medium">Find Artisans</button>
            <button onClick={() => navigate("/how-it-works")} className={`text-sm font-medium ${pathname === "/how-it-works" ? "text-[#1C4CD1] font-semibold" : "text-[#1F2937]"}`}>How It Works</button>
            <button onClick={() => navigate("/signup")} className="text-[#1F2937] text-sm font-medium">Become an Artisan</button>
          </nav>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => navigate("/login")} className="h-11 px-5 rounded-[10px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold">Log In</button>
            <button onClick={() => navigate("/signup")} className="h-11 px-5 rounded-[10px] bg-[#FA7E24] text-white text-sm font-semibold">Sign Up</button>
          </div>
        </>
      )}

      {variant === "app" && (
        <>
          <nav className="flex items-center gap-4 lg:gap-7 shrink-0">
            {CUSTOMER_LINKS.map((l) => <NavLink key={l.path} link={l} />)}
          </nav>
          {search !== undefined && (
            <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-[10px] h-11 px-4 flex-1 max-w-[280px] lg:max-w-[420px]">
              <span>🔍</span>
              <input
                value={search}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full outline-none text-[15px] text-[#1F2937] placeholder:text-[#9CA3AF] bg-transparent"
              />
            </div>
          )}
          <div className="flex-1" />
          <button onClick={() => navigate("/notifications")} className="relative text-lg shrink-0">
            🔔
            <span className="absolute -top-1 -right-1 bg-[#FA7E24] size-2 rounded-full" />
          </button>
          <button
            onClick={() => navigate(profilePath)}
            className="size-9 rounded-full bg-[#EEF2FF] text-[#1C4CD1] text-xs font-bold flex items-center justify-center shrink-0"
          >
            {initials(user?.fullName)}
          </button>
        </>
      )}

      {variant === "artisan" && (
        <>
          <nav className="flex items-center gap-4 lg:gap-7 shrink-0">
            {ARTISAN_LINKS.map((l) => <NavLink key={l.path} link={l} />)}
          </nav>
          <div className="flex-1" />
          <button onClick={() => navigate("/notifications")} className="relative text-lg shrink-0">
            🔔
            <span className="absolute -top-1 -right-1 bg-[#FA7E24] size-2 rounded-full" />
          </button>
          <button
            onClick={() => navigate("/artisan/profile")}
            className="size-9 rounded-full bg-[#EEF2FF] text-[#1C4CD1] text-xs font-bold flex items-center justify-center shrink-0"
          >
            {initials(user?.fullName)}
          </button>
        </>
      )}

      {variant === "admin" && (
        <>
          <div className="flex-1" />
          <span className="bg-[#EEF2FF] text-[#1C4CD1] text-sm font-semibold rounded-full px-4 py-1.5">Group 9 Admin</span>
        </>
      )}
    </div>
  );
}