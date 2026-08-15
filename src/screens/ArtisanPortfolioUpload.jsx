import { useNavigate } from "react-router-dom";
import { StatusSpace, Button } from "../components/UI";
import TopNav from "../components/TopNav";

export default function ArtisanPortfolioUpload() {
  const navigate = useNavigate();

  const UploadZone = ({ tall = false }) => (
    <button className={`border-2 border-dashed border-[#E5E7EB] rounded-2xl w-full flex flex-col items-center justify-center gap-3 text-center px-6 ${tall ? "h-[320px]" : "h-[270px]"}`}>
      <span className="text-4xl">🖼️</span>
      <span className="text-[#1F2937] text-sm font-semibold">Upload your image in SVG, PNG, JPEG</span>
      <span className="bg-[#1C4CD1] text-white text-sm font-semibold rounded-[10px] px-5 py-2">Upload</span>
    </button>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center gap-3 px-6 pt-2">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
        </div>
        <div className="flex-1 flex flex-col px-6 pt-4 gap-5">
          <h1 className="text-[#1F2937] text-2xl font-bold">Upload your portfolio photos</h1>
          <p className="text-[#6B7280] text-sm -mt-3">Show off your best work — customers trust artisans with photos.</p>
          {UploadZone({})}
          <button className="flex items-center gap-2 text-[#FF7A00] text-sm font-semibold self-start">⬆️ Upload next image</button>
        </div>
        <div className="p-6">
          <Button onClick={() => navigate("/artisan/kyc")}>Continue</Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="artisan" />
        <div className="flex-1 overflow-y-auto px-12 py-10 flex justify-center">
          <div className="w-full max-w-[640px] flex flex-col gap-6">
            <h1 className="text-[#1F2937] text-2xl font-bold">Upload your portfolio photos</h1>
            <p className="text-[#6B7280] text-sm -mt-3">Show off your best work — customers trust artisans with photos.</p>
            <div className="grid grid-cols-2 gap-4">
              {UploadZone({tall: true})}
              {UploadZone({tall: true})}
            </div>
            <Button className="max-w-[220px]" onClick={() => navigate("/artisan/kyc")}>Continue</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
