import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, StatusSpace } from "../components/UI";
import Logo from "../components/Logo";

export default function OtpVerification() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const role = params.get("role") || "customer";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const goNext = () => navigate(role === "artisan" ? "/artisan/build-profile" : "/home");

  const OtpBoxes = ({ size = 48 }) => (
    <div className="flex gap-2 justify-between">
      {otp.map((digit, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          maxLength={1}
          inputMode="numeric"
          style={{ width: size, height: size + 8 }}
          className="rounded-[10px] border border-[#E5E7EB] text-center text-[22px] font-bold text-[#1F2937] outline-none focus:border-[#FF7A00]"
        />
      ))}
    </div>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col gap-6 px-6 pt-10">
          <div className="size-16 rounded-2xl bg-[#F5F6F8] flex items-center justify-center text-3xl">📩</div>
          <div>
            <h1 className="text-[#1F2937] text-[28px] font-bold leading-[32px]">Verify Your Number</h1>
            <p className="text-[#6B7280] text-sm mt-3">
              Enter the 6-digit code we sent to +234 800 000 0000
            </p>
          </div>
          <OtpBoxes />
          <div className="flex gap-1.5 items-center">
            <span className="text-[#6B7280] text-sm">Didn&apos;t get a code?</span>
            <button className="text-[#0F2A44] text-sm font-semibold">Resend Code</button>
          </div>
        </div>
        <div className="p-6">
          <Button onClick={goNext}>Verify &amp; Continue</Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:h-full md:w-full">
        <div className="w-1/2 bg-[#0F2A44] flex flex-col justify-center px-16 gap-6">
          <Logo size={56} wordmarkClass="text-white" />
          <div className="h-[280px] rounded-2xl bg-white/10" />
          <p className="text-white text-2xl font-semibold leading-snug max-w-[420px]">
            A quick verification step keeps every account on HandiPlug real
            and trustworthy.
          </p>
        </div>
        <div className="w-1/2 flex items-center justify-center px-16">
          <div className="w-full max-w-[420px] flex flex-col gap-6">
            <h1 className="text-[#1F2937] text-[32px] font-bold">Verify Your Number</h1>
            <p className="text-[#6B7280] text-sm -mt-3">
              Enter the 6-digit code we sent to +234 800 000 0000
            </p>
            <OtpBoxes size={56} />
            <div className="flex gap-1.5 items-center">
              <span className="text-[#6B7280] text-sm">Didn&apos;t get a code?</span>
              <button className="text-[#0F2A44] text-sm font-semibold">Resend Code</button>
            </div>
            <Button onClick={goNext}>Verify &amp; Continue</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
