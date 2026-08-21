import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Label, Button, Avatar, TextInput } from "../components/UI";
import TopNav from "../components/TopNav";

const TRADE_OPTIONS = [
  { icon: "🔨", label: "Carpenter" },
  { icon: "🔧", label: "Plumber" },
  { icon: "⚡", label: "Electrician" },
  { icon: "🎨", label: "Painter" },
  { icon: "🧱", label: "Mason" },
  { icon: "❄️", label: "AC Technician" },
  { icon: "🚗", label: "Mechanic" },
  { icon: "🧹", label: "Cleaner" },
  { icon: "🪚", label: "Welder" },
  { icon: "🛠️", label: "Other" },
];

const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1 year",
  "2 years",
  "3 years",
  "4 years",
  "5 years",
  "6 years",
  "7 years",
  "8-10 years",
  "10+ years",
];

export default function ArtisanBuildProfile() {
  const navigate = useNavigate();

  const [trade, setTrade] = useState(TRADE_OPTIONS[0].label);
  const [tradeIcon, setTradeIcon] = useState(TRADE_OPTIONS[0].icon);
  const [experience, setExperience] = useState(EXPERIENCE_OPTIONS[6]);

  const SelectField = ({ label, icon, value, onChange, options, isTrade }) => (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => {
            if (isTrade) {
              const picked = TRADE_OPTIONS.find((o) => o.label === e.target.value);
              onChange(picked.label, picked.icon);
            } else {
              onChange(e.target.value);
            }
          }}
          className="w-full appearance-none flex items-center justify-between border border-[#E5E7EB] rounded-[10px] h-[52px] pl-[17px] pr-[36px] text-[#1F2937] text-[16px] bg-white outline-none focus:border-[#FF7A00] cursor-pointer"
        >
          {isTrade
            ? TRADE_OPTIONS.map((o) => (
                <option key={o.label} value={o.label}>
                  {o.icon} {o.label}
                </option>
              ))
            : options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
        </select>
        <span className="pointer-events-none absolute right-[17px] top-1/2 -translate-y-1/2 text-[#9CA3AF]">
          ▾
        </span>
        {isTrade && (
          <span className="pointer-events-none absolute left-[17px] top-1/2 -translate-y-1/2 opacity-0">
            {icon}
          </span>
        )}
      </div>
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

          <SelectField
            label="Wetin be your trade?"
            icon={tradeIcon}
            value={trade}
            onChange={(label, icon) => { setTrade(label); setTradeIcon(icon); }}
            isTrade
          />
          <SelectField
            label="Years of Experience"
            icon="📈"
            value={experience}
            onChange={setExperience}
            options={EXPERIENCE_OPTIONS}
          />

          {Bio()}
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
              <SelectField
                label="Wetin be your trade?"
                icon={tradeIcon}
                value={trade}
                onChange={(label, icon) => { setTrade(label); setTradeIcon(icon); }}
                isTrade
              />
              <SelectField
                label="Years of Experience"
                icon="📈"
                value={experience}
                onChange={setExperience}
                options={EXPERIENCE_OPTIONS}
              />
            </div>

            {Bio()}
            <TextInput label="Hourly Rate" defaultValue="₦8,000/hr" />
            <Button onClick={() => navigate("/artisan/portfolio")}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}