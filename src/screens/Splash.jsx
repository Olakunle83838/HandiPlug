import { useNavigate } from "react-router-dom";
import { Button } from "../components/UI";
import { CategoryTile } from "../components/DesktopExtras";
import { ArtisanCardDesktop } from "../components/DesktopExtras";
import TopNav from "../components/TopNav";
import Logo from "../components/Logo";
import { trades, topArtisans } from "../data/mockData";

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="bg-white flex flex-col h-full w-full overflow-y-auto">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden bg-[#1C4CD1] flex flex-col items-center h-full w-full">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-10">
          <Logo size={160} showWordmark={false} />
          <p className="text-white/70 font-bold text-base text-center">
            Artisan Problems, We go Solve am
          </p>
        </div>
        <div className="w-full px-6 pb-[60px]">
          <Button onClick={() => navigate("/onboarding")}>Get Started</Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="guest" />

        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-16 px-12 py-14 max-w-[1440px] mx-auto">
            <div className="flex-1 flex flex-col gap-6">
              <h1 className="text-[#1F2937] text-[40px] font-bold leading-[1.15]">
                Find skilled artisans you can trust.
              </h1>
              <p className="text-[#6B7280] text-lg leading-relaxed max-w-[460px]">
                Verified electricians, plumbers, carpenters and more — booked in
                minutes, backed by real reviews.
              </p>
              <div className="flex items-center gap-3 border border-[#E5E7EB] rounded-[10px] p-2 max-w-[560px]">
                <input
                  placeholder="What service do you need? e.g. Electrician"
                  className="flex-1 h-11 px-4 outline-none text-[15px] text-[#1F2937] placeholder:text-[#9CA3AF]"
                />
                <input
                  placeholder="Location"
                  className="w-[160px] h-11 px-4 border-l border-[#E5E7EB] outline-none text-[15px] text-[#1F2937] placeholder:text-[#9CA3AF]"
                />
                <button
                  onClick={() => navigate("/search")}
                  className="h-11 px-6 rounded-[8px] bg-[#FF7A00] text-white text-sm font-semibold shrink-0"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="flex-1 h-[340px] rounded-3xl bg-gradient-to-br from-[#1C4CD1] to-[#1E3A8A] flex items-center justify-center text-white/70 text-sm">
              [ Hero Illustration — Artisans at Work ]
            </div>
          </div>

          <div className="px-12 py-8 max-w-[1440px] mx-auto">
            <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px] mb-5">
              BROWSE BY CATEGORY
            </p>
            <div className="flex gap-6 flex-wrap">
              {trades.map((t) => (
                <CategoryTile key={t.label} icon={t.icon} label={t.label} onClick={() => navigate("/search")} />
              ))}
            </div>
          </div>

          <div className="px-12 py-8 max-w-[1440px] mx-auto">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px]">
                TOP VERIFIED ARTISANS
              </p>
              <button onClick={() => navigate("/search")} className="text-[#FF7A00] text-sm font-semibold">
                View all →
              </button>
            </div>
            <div className="flex gap-6 flex-wrap">
              {topArtisans.map((a) => (
                <ArtisanCardDesktop key={a.id} artisan={a} />
              ))}
            </div>
          </div>

          <div className="border-t border-[#E5E7EB] px-12 py-6 flex items-center justify-between max-w-[1440px] mx-auto">
            <p className="text-[#6B7280] text-sm">
              © 2026 HandiPlug. Built for Lagos artisans and customers.
            </p>
            <div className="flex gap-6">
              <span className="text-[#6B7280] text-sm">About</span>
              <span className="text-[#6B7280] text-sm">Support</span>
              <span className="text-[#6B7280] text-sm">Privacy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
