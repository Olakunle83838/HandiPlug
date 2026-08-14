import { useNavigate } from "react-router-dom";
import { Button } from "../components/UI";
import TopNav from "../components/TopNav";

export default function BookingConfirmation() {
  const navigate = useNavigate();

  const Content = ({ desktop = false }) => (
    <div className={`flex flex-col items-center gap-6 text-center ${desktop ? "" : "flex-1 justify-center px-10"}`}>
      <div className="size-[72px] rounded-full bg-[#22C55E]/12 bg-[rgba(34,197,94,0.12)] flex items-center justify-center text-[#22C55E] text-4xl">
        ✓
      </div>
      <h1 className="text-[#1F2937] text-2xl font-bold">Booking Confirmed</h1>
      <p className="text-[#6B7280] text-sm max-w-[380px]">
        Ifeanyi Obi will contact you shortly to confirm details for your electrician job.
      </p>
      <div className="border border-[#E5E7EB] rounded-2xl p-5 w-full max-w-[420px] flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="text-[#6B7280]">Artisan</span>
          <span className="text-[#1F2937] font-medium">Ifeanyi Obi</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#6B7280]">Date &amp; Time</span>
          <span className="text-[#1F2937] font-medium">Thu, 2:00 PM</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#6B7280]">Location</span>
          <span className="text-[#1F2937] font-medium">Lekki Phase 1</span>
        </div>
      </div>
      <div className="flex gap-3 w-full max-w-[420px]">
        <button onClick={() => navigate("/chat")} className="flex-1 h-11 rounded-[10px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold">
          Message Artisan
        </button>
        <button onClick={() => navigate("/bookings")} className="flex-1 h-11 rounded-[10px] bg-[#FF7A00] text-white text-sm font-semibold">
          View My Bookings
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        {Content({})}
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" />
        <div className="flex-1 flex items-center justify-center">
          {Content({desktop: true})}
        </div>
      </div>
    </div>
  );
}
