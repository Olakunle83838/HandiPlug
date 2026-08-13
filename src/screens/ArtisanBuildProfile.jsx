import { useNavigate } from "react-router-dom";
import { StatusSpace, Label, Button, Avatar, TextInput } from "../components/UI";
import TopNav from "../components/TopNav";

const FIELDS = [
  { icon: "🔨", label: "Trade / Category", value: "Carpenter" },
  { icon: "📈", label: "Years of Experience", value: "6 years" },
];

export default function ArtisanBuildProfile() {
  const navigate = useNavigate();

  const SelectField = ({ f }) => (
    <div className="flex flex-col gap-2">
      <Label>{f.label}</Label>
      <button className="w-full flex items-center justify-between border border-[#E5E7EB] rounded-[10px] h-[52px] px-[17px]">
        <span className="flex items-center gap-2 text-[#1F2937] text-[16px]"><span>{f.icon}</span>{f.value}</span>
        <span className="text-[#9CA3AF]">▾</span>
      </button>
    </div>
  );

  const Bio = () => (
    <div className="flex flex-col gap-2">
      <Label>Bio</Label>
      <textarea rows={4} placeholder="Tell customers about your craft, style and experience"
        className="border border-[#E5E7EB] rounded-[10px] p-4 text-[16px] text-[#1F2937] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF7A00] resize-none" />
    </div>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center justify-between px-6 pt-2">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
          <button onClick={() => navigate("/artisan/portfolio")} className="text-[#6B7280] text-sm font-medium">Skip</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-2 flex flex-col gap-5 pb-4">
          <h1 className="text-[#1F2937] text-2xl font-bold">Build your profile</h1>
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="relative">
              <Avatar size={110} />
              <button className="absolute bottom-0 right-0 size-8 rounded-full bg-[#FF7A00] text-white flex items-center justify-center text-lg border-2 border-white">+</button>
            </div>
          </div>
          {FIELDS.map((f) => <SelectField key={f.label} f={f} />)}
          <Bio />
          <TextInput label="Hourly Rate" defaultValue="₦8,000/hr" />
        </div>
        <div className="p-6">
          <Button onClick={() => navigate("/artisan/portfolio")}>Next</Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="artisan" />
        <div className="flex-1 overflow-y-auto px-12 py-10 flex justify-center">
          <div className="w-full max-w-[560px] flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-[#1F2937] text-2xl font-bold">Build your profile</h1>
              <button onClick={() => navigate("/artisan/portfolio")} className="text-[#6B7280] text-sm font-medium">Skip</button>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Avatar size={110} />
                <button className="absolute bottom-0 right-0 size-8 rounded-full bg-[#FF7A00] text-white flex items-center justify-center text-lg border-2 border-white">+</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {FIELDS.map((f) => <SelectField key={f.label} f={f} />)}
            </div>
            <Bio />
            <TextInput label="Hourly Rate" defaultValue="₦8,000/hr" />
            <Button onClick={() => navigate("/artisan/portfolio")}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
