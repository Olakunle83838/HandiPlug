import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StatusSpace, Avatar, VerifiedBadge, Stars, Label, Button } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import { api } from "../lib/api";
import { reviews as mockReviews } from "../data/mockData";

const FALLBACK = {
  id: null,
  fullName: "Bimpe Okafor",
  trade: "Electrician",
  yearsExperience: 6,
  area: "Lekki",
  rating: 4.9,
  reviewCount: 140,
  bio: "Licensed electrician with 6 years fixing wiring, inverter installs, and home rewiring across Lagos mainland & island. Punctual and transparent with pricing.",
  hourlyRate: 6500,
  calloutFee: 2000,
  verified: true,
};

function Badges({ artisan }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {artisan.verified && (
        <span className="bg-[#DCFCE7] text-[#15803D] text-xs font-semibold rounded-full px-3 py-1.5">
          🛡️ NIN Verified
        </span>
      )}
      {artisan.yearsExperience > 0 && (
        <span className="bg-[#EEF2FF] text-[#1C4CD1] text-xs font-semibold rounded-full px-3 py-1.5">
          {artisan.yearsExperience} yrs experience
        </span>
      )}
      {artisan.verified && (
        <span className="bg-[#FFF1E6] text-[#C2540A] text-xs font-semibold rounded-full px-3 py-1.5">
          ⚡ Fast responder
        </span>
      )}
    </div>
  );
}

export default function ArtisanProfile() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = params.get("id");
  const [artisan, setArtisan] = useState(FALLBACK);

  useEffect(() => {
    if (!id) return;
    api.getArtisan(id).then((res) => setArtisan(res.artisan)).catch(() => setArtisan(FALLBACK));
  }, [id]);

  const bookingLink = id ? `/booking-request?id=${id}` : "/booking-request";

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center gap-3 px-6 pt-2">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
          <h1 className="text-[#1F2937] text-xl font-bold">Artisan Profile</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-4 gap-5 flex flex-col pb-4">
          <div className="flex items-center gap-3.5">
            <div className="bg-[#EEF2FF] rounded-2xl size-16 flex items-center justify-center text-2xl shrink-0">⚡</div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[#1F2937] text-lg font-bold">{artisan.fullName}</p>
                {artisan.verified && <VerifiedBadge />}
              </div>
              <p className="text-[#6B7280] text-sm">{artisan.trade} · {artisan.area}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Stars rating={artisan.rating} />
                <span className="text-[#6B7280] text-sm">{artisan.rating} ({artisan.reviewCount} jobs)</span>
              </div>
            </div>
          </div>

          <Badges artisan={artisan} />

          <div className="flex flex-col gap-2">
            <Label>About</Label>
            <p className="text-[#1F2937] text-[15px] leading-6">{artisan.bio}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Portfolio</Label>
            <div className="flex gap-2.5">
              {[1, 2, 3].map((i) => <div key={i} className="size-20 rounded-2xl bg-[#F5F6F8]" />)}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Pricing</Label>
            <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
              <span className="text-[#1F2937] text-sm">Call-out visit</span>
              <span className="text-[#1F2937] text-sm font-semibold">₦{Number(artisan.calloutFee || 2000).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[#1F2937] text-sm">Hourly rate</span>
              <span className="text-[#1F2937] text-sm font-semibold">₦{Number(artisan.hourlyRate).toLocaleString()}/hr</span>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#E5E7EB]">
          <Button onClick={() => navigate(bookingLink)}>📅 Request Booking</Button>
        </div>
        <BottomNav />
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" />
        <div className="flex-1 overflow-y-auto px-12 py-10">
          <div className="flex gap-10 max-w-[1300px] mx-auto items-start">
            <div className="flex-1 flex flex-col gap-6">
              <button onClick={() => navigate(-1)} className="text-[#6B7280] text-sm self-start">← Back to search</button>

              <div className="flex items-center gap-4">
                <div className="bg-[#EEF2FF] rounded-2xl size-20 flex items-center justify-center text-3xl shrink-0">⚡</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[#1F2937] text-2xl font-bold">{artisan.fullName}</p>
                    {artisan.verified && <VerifiedBadge />}
                  </div>
                  <p className="text-[#6B7280] text-sm">{artisan.trade} · {artisan.area}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Stars rating={artisan.rating} />
                    <span className="text-[#6B7280] text-sm">{artisan.rating} ({artisan.reviewCount} jobs)</span>
                  </div>
                </div>
              </div>

              <Badges artisan={artisan} />

              <div>
                <Label>About</Label>
                <p className="text-[#1F2937] text-[15px] leading-6 mt-2">{artisan.bio}</p>
              </div>

              <div>
                <Label>Portfolio</Label>
                <div className="flex gap-3 mt-2">
                  {[1, 2, 3, 4].map((i) => <div key={i} className="w-[140px] h-[100px] rounded-2xl bg-[#F5F6F8]" />)}
                </div>
              </div>

              <div>
                <Label>Reviews ({artisan.reviewCount})</Label>
                <div className="flex flex-col gap-3 mt-2">
                  {mockReviews.map((r) => (
                    <div key={r.id} className="flex items-start gap-3">
                      <div className="size-9 rounded-full bg-[#F5F6F8] shrink-0" />
                      <div>
                        <Stars rating={r.rating} />
                        <p className="text-[#1F2937] text-sm mt-0.5">"{r.comment}" — {r.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-[320px] shrink-0 border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280] text-sm">Call-out visit</span>
                <span className="text-[#1F2937] text-sm font-semibold">₦{Number(artisan.calloutFee || 2000).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <span className="text-[#6B7280] text-sm">Hourly rate</span>
                <span className="text-[#1F2937] text-sm font-semibold">₦{Number(artisan.hourlyRate).toLocaleString()}/hr</span>
              </div>
              <Button onClick={() => navigate(bookingLink)}>📅 Request Booking</Button>
              <Button variant="outline" onClick={() => navigate("/chat")}>💬 Message</Button>
              <p className="text-[#9CA3AF] text-xs text-center">Response time: usually within 20 mins</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
