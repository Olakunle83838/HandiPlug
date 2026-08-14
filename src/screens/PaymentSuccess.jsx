import { useNavigate } from "react-router-dom";
import { StatusSpace, Button } from "../components/UI";
import TopNav from "../components/TopNav";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  const Card = () => (
    <div className="border border-[#E5E7EB] rounded-2xl w-full p-8 flex flex-col items-center gap-5 max-w-[500px]">
      <div className="size-[60px] rounded-full bg-[#22C55E]/12 bg-[rgba(34,197,94,0.12)] flex items-center justify-center text-[#22C55E] text-3xl">
        ✓
      </div>
      <h1 className="text-[#1F2937] text-2xl font-bold">Payment successful</h1>
      <p className="text-[#6B7280] text-sm text-center">
        &ldquo;Money don release to Musa since job don complete well well. E don enter him wallet&rdquo;
      </p>
      <div className="bg-[#F5F6F8] rounded-xl w-full p-4 flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#6B7280]">Amount paid</span>
          <span className="text-[#1F2937] font-semibold">₦19,163</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#6B7280]">Reference</span>
          <span className="text-[#1F2937] font-semibold">HP-9284-NG</span>
        </div>
      </div>
      <div className="flex gap-3 w-full">
        <button className="flex-1 h-11 rounded-[10px] border border-[#E5E7EB] text-[#1F2937] text-sm font-medium flex items-center justify-center gap-1">
          ⬇️ Receipt
        </button>
        <button onClick={() => navigate("/rating")} className="flex-1 h-11 rounded-[10px] bg-[#FF7A00] text-white text-sm font-medium flex items-center justify-center gap-1">
          ✍️ Leave a Review
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 text-center">
          {Card()}
        </div>
        <div className="p-6">
          <Button variant="outline" onClick={() => navigate("/home")}>Back to Home</Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" />
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {Card()}
          <Button className="max-w-[500px]" variant="outline" onClick={() => navigate("/home")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
