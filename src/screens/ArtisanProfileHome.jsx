import { useNavigate } from "react-router-dom";
import { StatusSpace, Avatar, VerifiedBadge, Stars } from "../components/UI";
import BottomNav from "../components/BottomNav";

const ROWS = ["Edit Profile", "Portfolio", "Payout Details", "Verification Status", "Settings"];

export default function ArtisanProfileHome() {
  const navigate = useNavigate();

  return (
    <div className="bg-white flex flex-col h-full w-full">
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
            <button
              key={row}
              onClick={() => row === "Portfolio" && navigate("/artisan/portfolio")}
              className="w-full flex items-center justify-between py-4 border-b border-[#E5E7EB] text-left"
            >
              <span className="text-[#1F2937] text-base">{row}</span>
              <span className="text-[#9CA3AF] text-lg">›</span>
            </button>
          ))}
          <button
            onClick={() => navigate("/login")}
            className="w-full text-left py-4 text-[#EF4444] text-base font-medium"
          >
            Logout
          </button>
        </div>
      </div>
      <BottomNav role="artisan" />
    </div>
  );
}
