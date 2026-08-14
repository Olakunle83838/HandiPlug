import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Card, Avatar, VerifiedBadge, Stars } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import { CategoryTile, ArtisanCardDesktop } from "../components/DesktopExtras";
import { trades } from "../data/mockData";
import { useArtisans } from "../lib/useArtisans";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const { artisans: topArtisans } = useArtisans({ verified: "true" });
  const firstName = user?.fullName?.split(" ")[0] || "there";

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="bg-[#0F2A44] px-6 pt-4 pb-8 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#F5F6F8] text-sm">Good Morning 👋</p>
                <p className="text-[#F5F6F8] text-xl font-semibold mt-1">{firstName}</p>
              </div>
              <button onClick={() => navigate("/notifications")} className="relative text-white text-2xl">
                🔔
                <span className="absolute -top-1 -right-1 bg-white text-[#0F2A44] text-[10px] font-medium rounded-full size-[15px] flex items-center justify-center">
                  5
                </span>
              </button>
            </div>
            <button
              onClick={() => navigate("/search")}
              className="bg-white rounded-[10px] w-full h-[90px] mt-5 flex items-center gap-3 px-4 text-left"
            >
              <span className="text-lg text-black/40">🔍</span>
              <span className="text-black/40 text-[16px] leading-[23px]">
                Wetin you need today? e.g Electrician
              </span>
            </button>
          </div>

          <div className="px-6 pt-4 flex flex-col gap-2.5">
            <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px]">BROWSE BY TRADE</p>
            <div className="flex gap-3.5 overflow-x-auto pb-1 -mx-1 px-1">
              {trades.map((t) => (
                <button key={t.label} onClick={() => navigate("/search")} className="flex flex-col items-center gap-2 shrink-0 w-[76px]">
                  <div className="bg-[#F5F6F8] rounded-2xl size-14 flex items-center justify-center text-2xl">{t.icon}</div>
                  <span className="text-[#6B7280] text-sm">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 pt-5">
            <div className="bg-[#0F2A44] rounded-[20px] p-5">
              <p className="text-white text-[16px] leading-[24px]">First job ₦1,000 off</p>
              <p className="text-white text-[16px] leading-[24px]">Book any verified artisan this week</p>
            </div>
          </div>

          <div className="px-6 pt-6 pb-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[#6B7280] text-xs font-medium tracking-[0.2px]">TOP VERIFIED ARTISANS</p>
              <button onClick={() => navigate("/search")} className="text-[#FF7A00] text-sm font-semibold">See all</button>
            </div>
            {topArtisans.map((a) => (
              <Card key={a.id} className="flex items-center gap-3.5 cursor-pointer" onClick={() => navigate(`/artisan-profile?id=${a.id}`)}>
                <Avatar />
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[#1F2937] text-sm font-semibold">{a.name}</p>
                    {a.verified && <VerifiedBadge />}
                  </div>
                  <p className="text-[#6B7280] text-sm">{a.trade} · {a.area}</p>
                  <div className="flex items-center justify-between">
                    <Stars rating={a.rating} />
                    <span className="text-[#FF7A00] text-sm font-bold">{a.price}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" search={search} onSearchChange={setSearch} />
        <div className="flex-1 overflow-y-auto">
          <div className="px-12 pt-8 max-w-[1440px] mx-auto">
            <h1 className="text-[#1F2937] text-[28px] font-bold">Good morning, {firstName} 👋</h1>
            <p className="text-[#6B7280] text-base mt-1">Find a verified artisan for your next job.</p>
          </div>

          <div className="px-12 pt-8 max-w-[1440px] mx-auto">
            <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px] mb-4">CATEGORIES</p>
            <div className="flex gap-8 flex-wrap">
              {[...trades, { icon: "🔥", label: "Welder" }].map((t) => (
                <CategoryTile key={t.label} icon={t.icon} label={t.label} big onClick={() => navigate("/search")} />
              ))}
            </div>
          </div>

          <div className="px-12 py-8 max-w-[1440px] mx-auto">
            <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px] mb-4">RECOMMENDED FOR YOU</p>
            <div className="flex gap-6 flex-wrap">
              {topArtisans.map((a) => (
                <ArtisanCardDesktop key={a.id} artisan={a} onView={() => navigate(`/artisan-profile?id=${a.id}`)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
