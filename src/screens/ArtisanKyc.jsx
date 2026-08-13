import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Label, Button, TextInput } from "../components/UI";
import TopNav from "../components/TopNav";
import { PendingBadge } from "../components/DesktopExtras";

const UPLOADED = [
  { id: 1, icon: "🪪", name: "NIN_Ifeanyi_Obi.pdf", meta: "Uploaded 2 hours ago" },
  { id: 2, icon: "🎓", name: "Trade_Certification.jpg", meta: "Uploaded 2 hours ago" },
];

export default function ArtisanKyc() {
  const navigate = useNavigate();
  const [docType, setDocType] = useState("National ID (NIN)");

  const DocTypeField = () => (
    <div className="flex flex-col gap-2">
      <Label>Document Type</Label>
      <button className="w-full flex items-center justify-between border border-[#E5E7EB] rounded-[10px] h-[52px] px-[17px]">
        <span className="text-[#1F2937] text-[16px]">{docType}</span>
        <span className="text-[#9CA3AF]">▾</span>
      </button>
    </div>
  );

  const UploadZone = ({ tall = false }) => (
    <button className={`border-2 border-dashed border-[#E5E7EB] rounded-2xl w-full flex flex-col items-center justify-center gap-2 text-center px-6 ${tall ? "h-[208px]" : "h-[160px]"}`}>
      <span className="text-3xl">📄</span>
      <span className="text-[#1F2937] text-sm font-semibold">Upload relevant document for verification</span>
      <span className="text-[#9CA3AF] text-xs">
        {tall ? "Drag and drop or browse · PNG, JPG or PDF · Max 5MB" : "PNG, JPG or PDF · Max 5MB"}
      </span>
      <span className="bg-[#F5F6F8] text-[#1F2937] text-sm font-semibold rounded-[10px] px-5 py-2 mt-1">Choose File</span>
    </button>
  );

  const DocRow = ({ doc }) => (
    <div className="flex items-center justify-between border border-[#E5E7EB] rounded-xl px-4 h-[68px]">
      <span className="flex items-center gap-3 text-[#1F2937] text-sm">
        <span className="size-9 rounded-lg bg-[#F5F6F8] flex items-center justify-center text-lg">{doc.icon}</span>
        <span>
          <span className="block font-medium">{doc.name}</span>
          <span className="block text-[#6B7280] text-xs">{doc.meta}</span>
        </span>
      </span>
      <PendingBadge />
    </div>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center gap-3 px-6 pt-2">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-2 flex flex-col gap-5 pb-4">
          <div>
            <h1 className="text-[#1F2937] text-2xl font-bold">Verify Your Identity</h1>
            <p className="text-[#6B7280] text-sm mt-2">
              HandiPlug requires ID verification (FR-03) to keep the platform safe for everyone.
            </p>
          </div>
          <DocTypeField />
          <UploadZone />
          <div className="flex flex-col gap-2">
            <Label>Uploaded documents</Label>
            {UPLOADED.map((d) => <DocRow key={d.id} doc={d} />)}
          </div>
        </div>
        <div className="p-6">
          <Button onClick={() => navigate("/artisan/dashboard")}>Submit for Verification</Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <div className="hidden md:flex items-center justify-between h-[72px] px-12 border-b border-[#E5E7EB] w-full shrink-0">
          <div className="w-10" />
          <PendingBadge>⏳ Verification Pending</PendingBadge>
        </div>
        <div className="flex-1 overflow-y-auto px-12 py-10">
          <div className="flex gap-16 max-w-[1300px] mx-auto">
            <div className="w-[340px] shrink-0 flex flex-col gap-5">
              <h1 className="text-[#1F2937] text-2xl font-bold">Verify Your Identity</h1>
              <p className="text-[#6B7280] text-sm">
                Upload relevant document for verification to unlock your Verified badge and start
                receiving bookings from customers.
              </p>
              <div className="border border-[#E5E7EB] rounded-2xl p-4">
                <p className="text-[#1F2937] text-sm font-semibold">Accepted documents</p>
                <p className="text-[#6B7280] text-sm mt-1">
                  National ID (NIN), Trade Certification, or Proof of Address.
                </p>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <DocTypeField />
                <TextInput label="ID / Cert Number" placeholder="e.g. 12345678901" />
              </div>
              <UploadZone tall />
              <div className="flex flex-col gap-2">
                <Label>Uploaded documents</Label>
                {UPLOADED.map((d) => <DocRow key={d.id} doc={d} />)}
              </div>
              <Button className="max-w-[220px]" onClick={() => navigate("/artisan/dashboard")}>
                Submit for Verification
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
