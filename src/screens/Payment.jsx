import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Avatar, Button } from "../components/UI";
import TopNav from "../components/TopNav";

const METHODS = [
  { id: "card", icon: "💳", label: "Card" },
  { id: "bank", icon: "🏦", label: "Bank Transfer" },
  { id: "wallet", icon: "👛", label: "HandiPlug Wallet" },
];

export default function Payment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState("card");

  const MethodList = () => (
    <div className="flex flex-col gap-2.5">
      <p className="text-[#1F2937] text-sm font-semibold">Choose payment method</p>
      {METHODS.map((m) => (
        <button
          key={m.id}
          onClick={() => setMethod(m.id)}
          className={`flex items-center justify-between border rounded-2xl px-4 h-[73px] transition ${
            method === m.id ? "border-[#FF7A00]" : "border-[#E5E7EB]"
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="text-xl">{m.icon}</span>
            <span className="text-[#1F2937] text-sm font-medium">{m.label}</span>
          </span>
          <span className={`size-5 rounded-full border-2 ${method === m.id ? "border-[#FF7A00] bg-[#FF7A00]" : "border-[#E5E7EB]"}`} />
        </button>
      ))}
    </div>
  );

  const Summary = () => (
    <div className="border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-3">
      <p className="text-[#1F2937] text-base font-semibold">Payment summary</p>
      <div className="flex justify-between text-sm text-[#6B7280]"><span>Labour (2.5hrs)</span><span>₦16,250</span></div>
      <div className="flex justify-between text-sm text-[#6B7280]"><span>Call-out visit</span><span>₦2,000</span></div>
      <div className="flex justify-between text-sm text-[#6B7280]"><span>Platform fee (5%)</span><span>₦913</span></div>
      <div className="h-px bg-[#E5E7EB]" />
      <div className="flex justify-between font-bold text-[#1F2937]"><span>Total</span><span>₦19,163</span></div>
      <div className="bg-[#F5F6F8] rounded-xl p-3 text-xs text-[#6B7280] flex gap-2">
        <span>↩️</span>
        Money stays with HandiPlug until you confirm the job is done — that's what
        keeps this platform trustworthy for everyone.
      </div>
      <Button onClick={() => navigate("/payment-success")}>💰 Pay ₦19,163 &amp; Release Funds</Button>
    </div>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 overflow-y-auto px-6 pt-4 flex flex-col gap-5 pb-4">
          <h1 className="text-[#1F2937] text-2xl font-bold">Complete Payment</h1>
          <div className="border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-3">
            <Avatar size={48} />
            <div>
              <p className="text-[#1F2937] font-semibold">Musa Ibrahim</p>
              <p className="text-[#6B7280] text-xs">Plumber · marked this job as done</p>
            </div>
          </div>
          {MethodList()}
          {Summary()}
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" />
        <div className="flex-1 overflow-y-auto px-12 py-10">
          <div className="max-w-[1120px] mx-auto flex flex-col gap-2">
            <h1 className="text-[#1F2937] text-3xl font-bold">Complete Payment</h1>
            <p className="text-[#6B7280] text-base mb-4">
              Musa marked this job as done. Confirm and pay to release his funds.
            </p>
            <div className="flex gap-8 items-start">
              <div className="flex-1 flex flex-col gap-6">
                <div className="border border-[#E5E7EB] rounded-2xl p-5 flex items-center gap-4">
                  <Avatar size={80} />
                  <div>
                    <p className="text-[#1F2937] text-xl font-bold">Musa Ibrahim</p>
                    <p className="text-[#6B7280] text-sm mt-1">Plumber · marked this job as done.</p>
                  </div>
                </div>
                {MethodList()}
              </div>
              <div className="w-[420px] shrink-0">
                {Summary()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
