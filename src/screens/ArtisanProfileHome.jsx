import { useNavigate } from "react-router-dom";
import { StatusSpace, Avatar, VerifiedBadge, Stars } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import SidebarDesktop from "../components/SidebarDesktop";

const ROWS = ["Edit Profile", "Portfolio", "Payout Details", "Verification Status", "Settings"];

export default function ArtisanProfileHome() {
  const navigate = useNavigate();

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
              <p className="text-[#1F2937] text-lg font-semibold">Ifeanyi Obi</p>
              <VerifiedBadge />
            </div>
            <p className="text-[#6B7280] text-sm">Electrician · Lekki, Lagos</p>
            <Stars rating={5} />
          </div>
          <div className="px-6 pt-4">
            {ROWS.map((row) => (
              <button key={row} onClick={() => row === "Portfolio" && navigate("/artisan/portfolio")} className="w-full flex items-center justify-between py-4 border-b border-[#E5E7EB] text-left">
                <span className="text-[#1F2937] text-base">{row}</span>
                <span className="text-[#9CA3AF] text-lg">›</span>
              </button>
            ))}
            <button onClick={() => navigate("/login")} className="w-full text-left py-4 text-[#EF4444] text-base font-medium">Logout</button>
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
              { label: "Edit Profile" },
              { label: "Portfolio", path: "/artisan/portfolio" },
              { label: "Payout Details" },
              { label: "Verification Status", path: "/artisan/kyc" },
              { label: "Logout", onClick: () => navigate("/login") },
            ]}
          />
          <div className="flex-1 overflow-y-auto px-12 py-10">
            <div className="max-w-[560px] mx-auto flex flex-col items-center gap-3 border border-[#E5E7EB] rounded-2xl p-8">
              <Avatar size={88} />
              <div className="flex items-center gap-2">
                <p className="text-[#1F2937] text-xl font-bold">Ifeanyi Obi</p>
                <VerifiedBadge />
              </div>
              <p className="text-[#6B7280] text-sm">Electrician · Lekki, Lagos</p>
              <Stars rating={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
