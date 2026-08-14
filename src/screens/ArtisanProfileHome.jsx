import { useNavigate } from "react-router-dom";
import { StatusSpace, Avatar, VerifiedBadge, Stars, Button } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import SidebarDesktop from "../components/SidebarDesktop";
import { useAuth } from "../context/AuthContext";

const ROWS = [
  { label: "Portfolio", path: "/artisan/portfolio" },
  { label: "Payout Details", path: "/artisan/payout" },
  { label: "Verification Status", path: "/artisan/kyc" },
  { label: "Brand / Logo", path: "/brand" },
  { label: "Settings", path: "/settings" },
];

export default function ArtisanProfileHome() {
  const navigate = useNavigate();
  const { user, isAuthed, logout } = useAuth();

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="px-6 pt-4">
            <h1 className="text-[#1F2937] text-2xl font-bold">Profile</h1>
          </div>
          <div className="flex flex-col items-center gap-2 pt-6 pb-2">
            <Avatar size={80} />
            <div className="flex items-center gap-2 mt-2">
              <p className="text-[#1F2937] text-lg font-semibold">{user?.fullName || "Guest"}</p>
              {user?.verified && <VerifiedBadge />}
            </div>
            <p className="text-[#6B7280] text-sm">{user?.trade ? `${user.trade} · ${user.area || "Lagos"}` : "Not logged in"}</p>
            {user?.rating > 0 && <Stars rating={user.rating} />}
            {!isAuthed && (
              <button onClick={() => navigate("/login")} className="text-[#FF7A00] text-sm font-semibold mt-1">Log In</button>
            )}
          </div>
          <div className="px-6 pt-4">
            {ROWS.map((row) => (
              <button key={row.label} onClick={() => navigate(row.path)} className="w-full flex items-center justify-between py-4 border-b border-[#E5E7EB] text-left">
                <span className="text-[#1F2937] text-base">{row.label}</span>
                <span className="text-[#9CA3AF] text-lg">›</span>
              </button>
            ))}
            {isAuthed && (
              <button onClick={doLogout} className="w-full text-left py-4 text-[#EF4444] text-base font-medium">Logout</button>
            )}
          </div>
        </div>
        <BottomNav role="artisan" />
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="artisan" />
        <div className="flex-1 flex overflow-hidden">
          <SidebarDesktop
            title="ARTISAN"
            links={[
              ...ROWS.map((r) => ({ label: r.label, path: r.path })),
              ...(isAuthed ? [{ label: "Logout", onClick: doLogout }] : []),
            ]}
          />
          <div className="flex-1 overflow-y-auto px-12 py-10">
            {isAuthed ? (
              <div className="max-w-[560px] mx-auto flex flex-col items-center gap-3 border border-[#E5E7EB] rounded-2xl p-8">
                <Avatar size={88} />
                <div className="flex items-center gap-2">
                  <p className="text-[#1F2937] text-xl font-bold">{user.fullName}</p>
                  {user.verified && <VerifiedBadge />}
                </div>
                <p className="text-[#6B7280] text-sm">{user.trade} · {user.area || "Lagos"}</p>
                {user.rating > 0 && <Stars rating={user.rating} />}
                {!user.verified && (
                  <button onClick={() => navigate("/artisan/kyc")} className="text-[#FF7A00] text-sm font-semibold mt-2">
                    Complete verification →
                  </button>
                )}
              </div>
            ) : (
              <div className="max-w-[360px] border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-3">
                <p className="text-[#6B7280] text-sm">Log in to see and manage your artisan profile.</p>
                <Button onClick={() => navigate("/login")}>Log In</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
