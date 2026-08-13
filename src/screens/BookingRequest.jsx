import { useNavigate } from "react-router-dom";
import { StatusSpace, TextInput, Button, Label, Avatar, VerifiedBadge, Stars } from "../components/UI";
import TopNav from "../components/TopNav";

export default function BookingRequest() {
  const navigate = useNavigate();

  const Form = () => (
    <>
      <div className="flex flex-col gap-2">
        <Label>Job Details</Label>
        <textarea
          rows={4}
          placeholder="Describe the job (e.g. rewire kitchen sockets)..."
          className="border border-[#E5E7EB] rounded-[10px] p-4 text-[16px] text-[#1F2937] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF7A00] resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextInput label="Date" icon="📅" placeholder="Select date" type="date" />
        <TextInput label="Time" icon="🕑" placeholder="Select time" type="time" />
      </div>
      <TextInput label="Location" placeholder="Service address" />
    </>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col overflow-y-auto px-6 pt-8 gap-5 pb-6">
          <div>
            <h1 className="text-[#1F2937] text-2xl font-bold">Request a Booking</h1>
            <p className="text-[#6B7280] text-sm mt-2">with Ifeanyi Obi · Electrician</p>
          </div>
          <Form />
          <Button className="mt-2" onClick={() => navigate("/booking-confirmation")}>Send Request</Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" />
        <div className="flex-1 flex items-center justify-center gap-16 px-12">
          <div className="w-[300px] border border-[#E5E7EB] rounded-2xl p-6 flex flex-col items-center gap-2">
            <Avatar size={72} />
            <p className="text-[#1F2937] text-lg font-bold mt-2">Ifeanyi Obi</p>
            <VerifiedBadge />
            <p className="text-[#6B7280] text-sm">Electrician · Lekki</p>
            <Stars rating={5} />
          </div>
          <div className="w-full max-w-[420px] flex flex-col gap-5">
            <h1 className="text-[#1F2937] text-2xl font-bold">Request a Booking</h1>
            <Form />
            <Button className="mt-2" onClick={() => navigate("/booking-confirmation")}>Send Request</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
