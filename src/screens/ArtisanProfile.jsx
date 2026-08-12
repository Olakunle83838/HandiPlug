import { useNavigate } from "react-router-dom";
import { StatusSpace, Avatar, VerifiedBadge, Stars, Label, Button } from "../components/UI";
import BottomNav from "../components/BottomNav";

export default function ArtisanProfile() {
  const navigate = useNavigate();

  return (
    <div className="bg-white flex flex-col h-full w-full">
      <StatusSpace />
      <div className="flex-1 flex flex-col overflow-y-auto px-6 pt-2 gap-6 pb-4">
        <div className="flex flex-col items-center gap-2">
          <Avatar size={88} />
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[#1F2937] text-2xl font-bold">Ifeanyi Obi</p>
            <VerifiedBadge />
          </div>
          <p className="text-[#6B7280] text-sm text-center">
            Electrician · 6 yrs experience · Lekki, Lagos
          </p>
          <div className="flex items-center gap-2">
            <Stars rating={5} />
            <span className="text-[#6B7280] text-sm">(84 reviews)</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Bio</Label>
          <p className="text-[#1F2937] text-[15px] leading-6">
            Certified electrician specialising in home wiring, installations, and repairs.
            Fast response, fair pricing.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Portfolio</Label>
          <div className="flex gap-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="size-20 rounded-2xl bg-[#F5F6F8]" />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#F5F6F8] rounded-xl px-4 h-12">
          <span className="text-[#6B7280] text-sm">Service Rate</span>
          <span className="text-[#1F2937] text-sm font-semibold">from ₦6,500</span>
        </div>
      </div>

      <div className="flex gap-3 px-6 py-4 border-t border-[#E5E7EB]">
        <Button variant="outline" onClick={() => navigate("/chat")}>
          💬 Message
        </Button>
        <Button onClick={() => navigate("/booking-request")}>Book Now</Button>
      </div>
      <BottomNav />
    </div>
  );
}
