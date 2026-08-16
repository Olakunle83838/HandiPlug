import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, StatusSpace } from "../components/UI";
import AuthSidePanel from "../components/AuthSidePanel";

export default function OtpVerification() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const role = params.get("role") || "customer";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(28);

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
          className="rounded-[10px] border border-[#1C4CD1] text-center text-[22px] font-bold text-[#1F2937] outline-none focus:border-[#FA7E24]"
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
          <div>
            <h1 className="text-[#1F2937] text-[28px] font-bold leading-[32px]">Verify your number</h1>
            <p className="text-[#6B7280] text-sm mt-3">
              We sent a 6-digit code to <span className="font-semibold text-[#1F2937]">080X XXX X289</span>
            </p>
          </div>
          {OtpBoxes({})}
          <p className="text-[#6B7280] text-sm">
            Resend code in <span className="font-bold text-[#1F2937]">00:{String(seconds).padStart(2, "0")}</span>
          </p>
        </div>
        <div className="p-6">
          <Button onClick={goNext}>→ Verify</Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:h-full md:w-full">
        <AuthSidePanel />
        <div className="w-1/2 flex items-center justify-center px-16">
          <div className="w-full max-w-[420px] flex flex-col gap-6">
            <div>
              <h1 className="text-[#1F2937] text-[32px] font-bold">Verify your number</h1>
              <p className="text-[#6B7280] text-base mt-1">
                We sent a 6-digit code to <span className="font-semibold text-[#1F2937]">080X XXX X289</span>
              </p>
            </div>
            {OtpBoxes({ size: 56 })}
            <Button onClick={goNext}>→ Verify</Button>
            <p className="text-[#6B7280] text-sm text-center">
              Resend code in <span className="font-bold text-[#1F2937]">00:{String(seconds).padStart(2, "0")}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
