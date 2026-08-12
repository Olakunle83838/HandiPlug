import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Label, Button } from "../components/UI";

const UPLOADED = [
  { id: 1, name: "NIN_Ifeanyi_Obi.pdf", status: "Pending review" },
  { id: 2, name: "Certification.jpg", status: "Pending review" },
];

export default function ArtisanKyc() {
  const navigate = useNavigate();
  const [docType, setDocType] = useState("National ID (NIN)");

  return (
    <div className="bg-white flex flex-col h-full w-full">
      <StatusSpace />
      <div className="flex items-center gap-3 px-6 pt-2">
        <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">
          ‹
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-2 flex flex-col gap-5 pb-4">
        <div>
          <h1 className="text-[#1F2937] text-2xl font-bold">Verify Your Identity</h1>
          <p className="text-[#6B7280] text-sm mt-2">
            HandiPlug requires ID verification (FR-03) to keep the platform safe for
            everyone. This usually takes less than 24 hours to review.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Document Type</Label>
          <button className="w-full flex items-center justify-between border border-[#E5E7EB] rounded-[10px] h-[52px] px-[17px]">
            <span className="text-[#1F2937] text-[16px]">{docType}</span>
            <span className="text-[#9CA3AF]">▾</span>
          </button>
        </div>

        <button className="border-2 border-dashed border-[#E5E7EB] rounded-2xl h-[160px] w-full flex flex-col items-center justify-center gap-2 text-center px-6">
          <span className="text-3xl">📄</span>
          <span className="text-[#1F2937] text-sm font-semibold">
            Upload relevant document for verification
          </span>
          <span className="text-[#9CA3AF] text-xs">PNG, JPG or PDF · Max 5MB</span>
          <span className="bg-[#F5F6F8] text-[#1F2937] text-sm font-semibold rounded-[10px] px-5 py-2 mt-1">
            Choose File
          </span>
        </button>

        <div className="flex flex-col gap-2">
          <Label>Uploaded documents</Label>
          {UPLOADED.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between border border-[#E5E7EB] rounded-xl px-4 h-[56px]"
            >
              <span className="flex items-center gap-2 text-[#1F2937] text-sm">
                📎 {doc.name}
              </span>
              <span className="text-[#FF7A00] text-xs font-semibold">{doc.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        <Button onClick={() => navigate("/artisan/dashboard")}>
          Submit for Verification
        </Button>
      </div>
    </div>
  );
}
