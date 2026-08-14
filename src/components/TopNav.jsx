import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";

const CUSTOMER_LINKS = [
  { icon: "🏠", label: "Home", path: "/home" },
  { icon: "🔍", label: "Search", path: "/search" },
  { icon: "📋", label: "Bookings", path: "/bookings" },
  { icon: "💬", label: "Chat", path: "/chat" },
];

const ARTISAN_LINKS = [
  { icon: "🏠", label: "Home", path: "/artisan/dashboard" },
  { icon: "🧰", label: "Jobs", path: "/artisan/jobs" },
  { icon: "💬", label: "Chat", path: "/chat" },
];

/**
 * Desktop top navigation bar. Hidden on mobile (md:flex) — mobile screens
 * keep their existing StatusSpace/back-arrow header + BottomNav pattern.
 * variant: "guest" | "app" | "artisan" | "admin"
 */
export default function TopNav({
  variant = "app",
  search,
  onSearchChange,
  searchPlaceholder = "Search trade or artisan name...",
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const NavLink = ({ link }) => {
    const active = pathname === link.path;
    return (
      <button
        key={link.path}
        onClick={() => navigate(link.path)}
        className={`flex items-center gap-1.5 text-sm font-medium transition ${
          active ? "text-[#FF7A00]" : "text-[#1F2937] hover:text-[#FF7A00]"
        }`}
      >
        <span>{link.icon}</span>
        {link.label}
      </button>
    );
  };

  return (
    <div className="hidden md:flex items-center justify-between h-[72px] px-6 lg:px-12 border-b border-[#E5E7EB] w-full shrink-0 gap-4 lg:gap-6">
      <button onClick={() => navigate(variant === "guest" ? "/landing" : "/home")} className="shrink-0">
        <Logo size={40} />
      </button>

      {variant === "guest" && (
        <>
          <nav className="flex items-center gap-8">
            <button onClick={() => navigate("/splash")} className="text-[#1F2937] text-sm font-medium">Home</button>
            <button onClick={() => navigate("/search")} className="text-[#1F2937] text-sm font-medium">Find Artisans</button>
            <button className="text-[#1F2937] text-sm font-medium">How It Works</button>
            <button onClick={() => navigate("/signup")} className="text-[#1F2937] text-sm font-medium">Become an Artisan</button>
          </nav>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => navigate("/login")} className="h-11 px-5 rounded-[10px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold">Log In</button>
            <button onClick={() => navigate("/signup")} className="h-11 px-5 rounded-[10px] bg-[#FF7A00] text-white text-sm font-semibold">Sign Up</button>
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
          <button
            onClick={() => navigate("/profile")}
            className={`size-9 rounded-full flex items-center justify-center shrink-0 ${pathname === "/profile" ? "bg-[#FF7A00] text-white" : "bg-[#F5F6F8]"}`}
          >
            👤
          </button>
        </>
      )}

      {variant === "artisan" && (
        <>
          <nav className="flex items-center gap-7 shrink-0">
            {ARTISAN_LINKS.map((l) => <NavLink key={l.path} link={l} />)}
          </nav>
          <div className="flex-1" />
          <button
            onClick={() => navigate("/artisan/profile")}
            className={`size-9 rounded-full flex items-center justify-center shrink-0 ${pathname === "/artisan/profile" ? "bg-[#FF7A00] text-white" : "bg-[#F5F6F8]"}`}
          >
            👤
          </button>
        </>
      )}

      {variant === "admin" && (
        <>
          <div className="flex-1" />
          <div className="size-9 rounded-full bg-[#0F2A44] flex items-center justify-center text-white shrink-0">🛡️</div>
        </>
      )}
    </div>
  );
}
