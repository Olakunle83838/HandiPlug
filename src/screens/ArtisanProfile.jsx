import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StatusSpace, Avatar, VerifiedBadge, Stars, Label, Button } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import { api } from "../lib/api";

const FALLBACK = {
  id: null,
  fullName: "Ifeanyi Obi",
  trade: "Electrician",
  yearsExperience: 6,
  area: "Lekki, Lagos",
  rating: 5,
  reviewCount: 84,
  bio: "Certified electrician specialising in home wiring, installations, and repairs. Fast response, fair pricing.",
  hourlyRate: 6500,
  verified: true,
};

export default function ArtisanProfile() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = params.get("id");
  const [artisan, setArtisan] = useState(FALLBACK);

  useEffect(() => {
    if (!id) return;
    api
      .getArtisan(id)
      .then((res) => setArtisan(res.artisan))
      .catch(() => setArtisan(FALLBACK));
  }, [id]);

  const bookingLink = id ? `/booking-request?id=${id}` : "/booking-request";

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col overflow-y-auto px-6 pt-2 gap-6 pb-4">
          <div className="flex flex-col items-center gap-2">
            <Avatar size={88} />
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[#1F2937] text-2xl font-bold">{artisan.fullName}</p>
              {artisan.verified && <VerifiedBadge />}
            </div>
            <p className="text-[#6B7280] text-sm text-center">
              {artisan.trade} · {artisan.yearsExperience} yrs experience · {artisan.area}
            </p>
            <div className="flex items-center gap-2">
              <Stars rating={artisan.rating} />
              <span className="text-[#6B7280] text-sm">({artisan.reviewCount} reviews)</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Bio</Label>
            <p className="text-[#1F2937] text-[15px] leading-6">{artisan.bio}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Portfolio</Label>
            <div className="flex gap-2.5">
              {[1, 2, 3].map((i) => <div key={i} className="size-20 rounded-2xl bg-[#F5F6F8]" />)}
            </div>
          </div>
          <div className="flex items-center justify-between bg-[#F5F6F8] rounded-xl px-4 h-12">
            <span className="text-[#6B7280] text-sm">Service Rate</span>
            <span className="text-[#1F2937] text-sm font-semibold">from ₦{Number(artisan.hourlyRate).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-[#E5E7EB]">
          <Button variant="outline" onClick={() => navigate("/chat")}>💬 Message</Button>
          <Button onClick={() => navigate(bookingLink)}>Book Now</Button>
        </div>
        <BottomNav />
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" search="" />
        <div className="flex-1 overflow-y-auto px-12 py-10">
          <div className="flex gap-10 max-w-[1400px] mx-auto">
            <div className="w-[320px] shrink-0 border border-[#E5E7EB] rounded-2xl p-6 flex flex-col items-center gap-2 h-fit">
              <Avatar size={88} />
              <p className="text-[#1F2937] text-xl font-bold mt-2">{artisan.fullName}</p>
              {artisan.verified && <VerifiedBadge />}
              <p className="text-[#6B7280] text-sm text-center mt-1">{artisan.trade} · {artisan.yearsExperience} yrs experience</p>
              <p className="text-[#6B7280] text-sm">{artisan.area}</p>
              <Stars rating={artisan.rating} />
              <div className="flex items-center justify-between bg-[#F5F6F8] rounded-xl px-4 h-12 w-full mt-3">
                <span className="text-[#6B7280] text-sm">Service Rate</span>
                <span className="text-[#1F2937] text-sm font-semibold">from ₦{Number(artisan.hourlyRate).toLocaleString()}</span>
              </div>
              <Button className="mt-3" onClick={() => navigate(bookingLink)}>Book Now</Button>
              <Button variant="outline" onClick={() => navigate("/chat")}>💬 Message</Button>
            </div>

            <div className="flex-1 flex flex-col gap-8">
              <div className="flex gap-6 border-b border-[#E5E7EB] pb-3">
                <span className="text-[#0F2A44] text-sm font-semibold border-b-2 border-[#FF7A00] pb-3 -mb-3.5">About</span>
                <span className="text-[#6B7280] text-sm">Portfolio</span>
                <span className="text-[#6B7280] text-sm">Reviews ({artisan.reviewCount})</span>
              </div>
              <div>
                <Label>Bio</Label>
                <p className="text-[#1F2937] text-[15px] leading-6 mt-2">{artisan.bio}</p>
              </div>
              <div>
                <Label>Portfolio</Label>
                <div className="flex gap-3 mt-2">
                  {[1, 2, 3, 4].map((i) => <div key={i} className="w-[140px] h-[100px] rounded-2xl bg-[#F5F6F8]" />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
