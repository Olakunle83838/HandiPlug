import { useNavigate } from "react-router-dom";
import { StatusSpace, Avatar, VerifiedBadge, Stars, Label, Button } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";

export default function ArtisanProfile() {
  const navigate = useNavigate();

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col overflow-y-auto px-6 pt-2 gap-6 pb-4">
          <div className="flex flex-col items-center gap-2">
            <Avatar size={88} />
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[#1F2937] text-2xl font-bold">Ifeanyi Obi</p>
              <VerifiedBadge />
            </div>
            <p className="text-[#6B7280] text-sm text-center">Electrician · 6 yrs experience · Lekki, Lagos</p>
            <div className="flex items-center gap-2">
              <Stars rating={5} />
              <span className="text-[#6B7280] text-sm">(84 reviews)</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Bio</Label>
            <p className="text-[#1F2937] text-[15px] leading-6">
              Certified electrician specialising in home wiring, installations, and repairs. Fast response, fair pricing.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Portfolio</Label>
            <div className="flex gap-2.5">
              {[1, 2, 3].map((i) => <div key={i} className="size-20 rounded-2xl bg-[#F5F6F8]" />)}
            </div>
          </div>
          <div className="flex items-center justify-between bg-[#F5F6F8] rounded-xl px-4 h-12">
            <span className="text-[#6B7280] text-sm">Service Rate</span>
            <span className="text-[#1F2937] text-sm font-semibold">from ₦6,500</span>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-[#E5E7EB]">
          <Button variant="outline" onClick={() => navigate("/chat")}>💬 Message</Button>
          <Button onClick={() => navigate("/booking-request")}>Book Now</Button>
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
              <p className="text-[#1F2937] text-xl font-bold mt-2">Ifeanyi Obi</p>
              <VerifiedBadge />
              <p className="text-[#6B7280] text-sm text-center mt-1">Electrician · 6 yrs experience</p>
              <p className="text-[#6B7280] text-sm">Lekki, Lagos</p>
              <Stars rating={5} />
              <div className="flex items-center justify-between bg-[#F5F6F8] rounded-xl px-4 h-12 w-full mt-3">
                <span className="text-[#6B7280] text-sm">Service Rate</span>
                <span className="text-[#1F2937] text-sm font-semibold">from ₦6,500</span>
              </div>
              <Button className="mt-3" onClick={() => navigate("/booking-request")}>Book Now</Button>
              <Button variant="outline" onClick={() => navigate("/chat")}>💬 Message</Button>
            </div>

            <div className="flex-1 flex flex-col gap-8">
              <div className="flex gap-6 border-b border-[#E5E7EB] pb-3">
                <span className="text-[#0F2A44] text-sm font-semibold border-b-2 border-[#FF7A00] pb-3 -mb-3.5">About</span>
                <span className="text-[#6B7280] text-sm">Portfolio</span>
                <span className="text-[#6B7280] text-sm">Reviews (84)</span>
              </div>
              <div>
                <Label>Bio</Label>
                <p className="text-[#1F2937] text-[15px] leading-6 mt-2">
                  Certified electrician specialising in home wiring, installations, and repairs. Fast
                  response, fair pricing, and over 400 completed jobs across Lagos.
                </p>
              </div>
              <div>
                <Label>Portfolio</Label>
                <div className="flex gap-3 mt-2">
                  {[1, 2, 3, 4].map((i) => <div key={i} className="w-[140px] h-[100px] rounded-2xl bg-[#F5F6F8]" />)}
                </div>
              </div>
              <div>
                <Label>Recent Reviews</Label>
                <div className="border border-[#E5E7EB] rounded-2xl p-4 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1F2937] text-sm font-semibold">Amaka O.</span>
                    <Stars rating={5} />
                  </div>
                  <p className="text-[#6B7280] text-sm mt-2">
                    Fast, professional, and reasonably priced. Highly recommend!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
