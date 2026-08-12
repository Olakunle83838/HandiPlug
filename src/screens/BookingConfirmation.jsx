import { useNavigate } from "react-router-dom";
import { Button } from "../components/UI";

export default function BookingConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="bg-white flex flex-col h-full w-full">
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-10 text-center">
        <div className="size-[72px] rounded-full bg-[#22C55E]/12 bg-[rgba(34,197,94,0.12)] flex items-center justify-center text-[#22C55E] text-4xl">
          ✓
        </div>
        <h1 className="text-[#1F2937] text-2xl font-bold">Booking Confirmed</h1>
        <div className="flex gap-3">
          <span className="bg-[#F5F6F8] rounded-full px-4 py-2 text-sm font-medium text-[#1F2937]">
            Thursday
          </span>
          <span className="bg-[#F5F6F8] rounded-full px-4 py-2 text-sm font-medium text-[#1F2937]">
            2:00 PM
          </span>
        </div>
        <p className="text-[#6B7280] text-sm">
          Ifeanyi will contact you shortly to confirm details.
        </p>
      </div>
      <div className="p-6">
        <Button onClick={() => navigate("/bookings")}>View Booking</Button>
      </div>
    </div>
  );
}
