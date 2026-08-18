import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button, StatusSpace } from "../components/UI";
import AuthSidePanel from "../components/AuthSidePanel";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { verifyOtp } = useAuth();
  
  const email = location.state?.email || "";
  const role = params.get("role") || "customer";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const submitOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit code");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await verifyOtp({ email, otp: code });
      navigate(role === "artisan" ? "/artisan/build-profile" : "/home");
    } catch (err) {
      setError(err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (seconds > 0) return;
    setError("");
    try {
      await api.resendOtp({ email });
      setSeconds(60);
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

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
            <h1 className="text-[#1F2937] text-[28px] font-bold leading-[32px]">Verify your email</h1>
            <p className="text-[#6B7280] text-sm mt-3">
              We sent a 6-digit code to <span className="font-semibold text-[#1F2937] break-all">{email}</span>
            </p>
          </div>
          {OtpBoxes({})}
          {error && <p className="text-[#EF4444] text-sm">{error}</p>}
          <p className="text-[#6B7280] text-sm">
            {seconds > 0 ? (
              <>Resend code in <span className="font-bold text-[#1F2937]">00:{String(seconds).padStart(2, "0")}</span></>
            ) : (
              <button onClick={resendOtp} className="text-[#1C4CD1] font-semibold">Resend code now</button>
            )}
          </p>
        </div>
        <div className="p-6">
          <Button onClick={submitOtp} disabled={loading}>
            {loading ? "Verifying..." : "→ Verify"}
          </Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:h-full md:w-full">
        <AuthSidePanel />
        <div className="w-1/2 flex items-center justify-center px-16">
          <div className="w-full max-w-[420px] flex flex-col gap-6">
            <div>
              <h1 className="text-[#1F2937] text-[32px] font-bold">Verify your email</h1>
              <p className="text-[#6B7280] text-base mt-1">
                We sent a 6-digit code to <span className="font-semibold text-[#1F2937] break-all">{email}</span>
              </p>
            </div>
            {OtpBoxes({ size: 56 })}
            {error && <p className="text-[#EF4444] text-sm">{error}</p>}
            <Button onClick={submitOtp} disabled={loading}>
              {loading ? "Verifying..." : "→ Verify"}
            </Button>
            <p className="text-[#6B7280] text-sm text-center">
              {seconds > 0 ? (
                <>Resend code in <span className="font-bold text-[#1F2937]">00:{String(seconds).padStart(2, "0")}</span></>
              ) : (
                <button onClick={resendOtp} className="text-[#1C4CD1] font-semibold">Resend code now</button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
