import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Card, Avatar, VerifiedBadge, Stars } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import Logo from "../components/Logo";
import { ArtisanCardDesktop } from "../components/DesktopExtras";
import { trades } from "../data/mockData";
import { useArtisans } from "../lib/useArtisans";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [heroSearch, setHeroSearch] = useState("");
  const { user } = useAuth();
  const { artisans: topArtisans } = useArtisans({ verified: "true" });
  const firstName = user?.fullName?.split(" ")[0] || "there";

  const goToTrade = (trade) => navigate(`/search?trade=${encodeURIComponent(trade)}`);
  const submitHeroSearch = () => {
    if (heroSearch.trim()) navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    else navigate("/search");
  };

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="bg-[#1C4CD1] px-6 pt-4 pb-8 relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm">Good afternoon,</p>
                <p className="text-white text-xl font-semibold mt-1">{firstName} 👋</p>
              </div>
              <button onClick={() => navigate("/notifications")} className="relative text-white text-2xl">
                🔔
                <span className="absolute -top-1 -right-1 bg-white text-[#1C4CD1] text-[10px] font-medium rounded-full size-[15px] flex items-center justify-center">
                  5
                </span>
              </button>
            </div>
            <button
              onClick={() => navigate("/search")}
              className="bg-white rounded-[10px] w-full h-[56px] mt-5 flex items-center gap-3 px-4 text-left"
            >
              <span className="text-lg text-black/40">🔍</span>
              <span className="text-black/40 text-[16px] leading-[23px]">
                Wetin you need today? e.g. Electrician
              </span>
            </button>
          </div>

          <div className="px-6 pt-4 flex flex-col gap-2.5">
            <p className="text-[#1F2937] text-sm font-bold">Browse by trade</p>
            <div className="flex gap-3.5 overflow-x-auto pb-1 -mx-1 px-1">
              {trades.map((t) => (
                <button key={t.label} onClick={() => goToTrade(t.label)} className="flex flex-col items-center gap-2 shrink-0 w-[76px]">
                  <div className="bg-[#EEF2FF] rounded-2xl size-14 flex items-center justify-center text-2xl">{t.icon}</div>
                  <span className="text-[#6B7280] text-sm">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 pt-5">
            <div className="bg-[#FA7E24] rounded-[16px] p-5">
              <p className="text-white text-[16px] font-bold leading-[22px]">First job ₦1,000 off</p>
              <p className="text-white/90 text-sm leading-[20px] mt-0.5">Book any verified artisan this week</p>
            </div>
          </div>

          <div className="px-6 pt-6 pb-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[#1F2937] text-sm font-bold">Top rated near you</p>
              <button onClick={() => navigate("/search")} className="text-[#1C4CD1] text-sm font-semibold">See all</button>
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
                    <span className="text-[#1C4CD1] text-sm font-bold">{a.price}</span>
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
            <div className="bg-[#1C4CD1] rounded-[20px] px-10 py-9 relative overflow-hidden flex items-center justify-between">
              <div className="max-w-[520px] relative z-10">
                <h1 className="text-white text-[26px] font-bold">Good afternoon, {firstName} 👋</h1>
                <p className="text-white/80 text-base mt-1">Wetin you need today? Book a verified artisan in minutes.</p>
                <div className="flex items-center gap-2 bg-white rounded-[10px] h-[52px] px-4 mt-5">
                  <span className="text-black/40">🔍</span>
                  <input
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitHeroSearch()}
                    placeholder="e.g. Electrician for socket rewiring"
                    className="w-full outline-none text-[15px] text-[#1F2937] placeholder:text-[#9CA3AF] bg-transparent"
                  />
                </div>
              </div>
              <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-90">
                <Logo size={90} variant="icon" />
              </div>
            </div>
          </div>

          <div className="px-12 pt-8 max-w-[1440px] mx-auto">
            <p className="text-[#1F2937] text-base font-bold mb-4">Browse by trade</p>
            <div className="grid grid-cols-5 gap-4">
              {trades.map((t) => (
                <button
                  key={t.label}
                  onClick={() => goToTrade(t.label)}
                  className="bg-white border border-[#E5E7EB] rounded-2xl py-6 flex flex-col items-center gap-2 hover:border-[#1C4CD1] transition"
                >
                  <span className="text-[#1C4CD1] text-2xl">{t.icon}</span>
                  <span className="text-[#1F2937] text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-12 py-8 max-w-[1440px] mx-auto flex gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[#1F2937] text-base font-bold">Top rated near you</p>
                <button onClick={() => navigate("/search")} className="text-[#1C4CD1] text-sm font-semibold">See all →</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {topArtisans.map((a) => (
                  <div key={a.id} className="border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-3.5">
                    <Avatar size={48} />
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[#1F2937] text-sm font-semibold">{a.name}</p>
                        {a.verified && <VerifiedBadge />}
                      </div>
                      <p className="text-[#6B7280] text-sm">{a.trade} · {a.area}</p>
                      <div className="flex items-center justify-between">
                        <Stars rating={a.rating} />
                        <button onClick={() => navigate(`/artisan-profile?id=${a.id}`)} className="text-[#1C4CD1] text-sm font-semibold">
                          {a.price}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-[300px] shrink-0 flex flex-col gap-4">
              <div className="bg-[#FA7E24] rounded-2xl p-5">
                <p className="text-white text-base font-bold">First job ₦1,000 off</p>
                <p className="text-white/90 text-sm mt-1">Book any verified artisan this week and save.</p>
              </div>
              <div className="border border-[#E5E7EB] rounded-2xl p-5">
                <p className="text-[#1F2937] text-sm font-bold mb-2">Your recent booking</p>
                <p className="text-[#1F2937] text-sm font-semibold">Bimpe Okafor</p>
                <p className="text-[#6B7280] text-sm">Sat, 09 Aug · 10:00 AM</p>
                <button
                  onClick={() => navigate("/bookings")}
                  className="w-full h-10 rounded-[8px] border border-[#E5E7EB] text-[#1C4CD1] text-sm font-semibold mt-4"
                >
                  View bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
