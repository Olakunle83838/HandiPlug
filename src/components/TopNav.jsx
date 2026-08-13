import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

/**
 * Desktop top navigation bar. Hidden on mobile (md:flex) — mobile screens
 * keep their existing StatusSpace/back-arrow header pattern.
 * variant: "guest" | "app" | "artisan" | "admin"
 */
export default function TopNav({
  variant = "app",
  search,
  onSearchChange,
  searchPlaceholder = "Search trade or artisan name...",
}) {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center justify-between h-[72px] px-12 border-b border-[#E5E7EB] w-full shrink-0">
      <button onClick={() => navigate(variant === "guest" ? "/landing" : "/home")}>
        <Logo size={40} />
      </button>

      {variant === "guest" && (
        <>
          <nav className="flex items-center gap-8">
            <button onClick={() => navigate("/landing")} className="text-[#1F2937] text-sm font-medium">
              Home
            </button>
            <button onClick={() => navigate("/search")} className="text-[#1F2937] text-sm font-medium">
              Find Artisans
            </button>
            <button className="text-[#1F2937] text-sm font-medium">How It Works</button>
            <button onClick={() => navigate("/signup")} className="text-[#1F2937] text-sm font-medium">
              Become an Artisan
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="h-11 px-5 rounded-[10px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="h-11 px-5 rounded-[10px] bg-[#FF7A00] text-white text-sm font-semibold"
            >
              Sign Up
            </button>
          </div>
        </>
      )}

      {variant === "app" && (
        <>
          {search !== undefined && (
            <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-[10px] h-11 px-4 w-[520px] max-w-[40vw]">
              <span>🔍</span>
              <input
                value={search}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full outline-none text-[15px] text-[#1F2937] placeholder:text-[#9CA3AF] bg-transparent"
              />
            </div>
          )}
          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/bookings")} className="text-[#1F2937] text-sm font-medium">
              📋 Bookings
            </button>
            <button onClick={() => navigate("/chat")} className="text-[#1F2937] text-sm font-medium">
              💬 Messages
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="size-9 rounded-full bg-[#F5F6F8] flex items-center justify-center"
            >
              👤
            </button>
          </div>
        </>
      )}

      {variant === "artisan" && (
        <div className="flex items-center gap-6">
          <button onClick={() => navigate("/artisan/jobs")} className="text-[#1F2937] text-sm font-medium">
            📋 Jobs
          </button>
          <button onClick={() => navigate("/chat")} className="text-[#1F2937] text-sm font-medium">
            💬 Messages
          </button>
          <button
            onClick={() => navigate("/artisan/profile")}
            className="size-9 rounded-full bg-[#F5F6F8] flex items-center justify-center"
          >
            👤
          </button>
        </div>
      )}

      {variant === "admin" && (
        <div className="size-9 rounded-full bg-[#0F2A44] flex items-center justify-center text-white">
          🛡️
        </div>
      )}
    </div>
  );
}
