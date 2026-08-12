import { useNavigate } from "react-router-dom";
import { StatusSpace, TextInput, Button, Label } from "../components/UI";

export default function BookingRequest() {
  const navigate = useNavigate();

  return (
    <div className="bg-white flex flex-col h-full w-full">
      <StatusSpace />
      <div className="flex-1 flex flex-col overflow-y-auto px-6 pt-8 gap-5 pb-6">
        <div>
          <h1 className="text-[#1F2937] text-2xl font-bold">Request a Booking</h1>
          <p className="text-[#6B7280] text-sm mt-2">with Ifeanyi Obi · Electrician</p>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Job Details</Label>
          <textarea
            rows={4}
            placeholder="Describe the job (e.g. rewire kitchen sockets)..."
            className="border border-[#E5E7EB] rounded-[10px] p-4 text-[16px] text-[#1F2937] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF7A00] resize-none"
          />
        </div>

        <TextInput label="Date" icon="📅" placeholder="Select date" type="date" />
        <TextInput label="Time" icon="🕑" placeholder="Select time" type="time" />
        <TextInput label="Location" placeholder="Service address" />

        <Button className="mt-2" onClick={() => navigate("/booking-confirmation")}>
          Send Request
        </Button>
      </div>
    </div>
  );
}
