import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button, StatusSpace } from "../components/UI";
import AuthSidePanel from "../components/AuthSidePanel";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { getPostAuthPath } from "../lib/auth";

const EMPTY_CODE = Array(6).fill("");

export default function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { verifyOtp } = useAuth();
  const email = location.state?.email || params.get("email") || "";
  const inputs = useRef([]);
  const [otp, setOtp] = useState(EMPTY_CODE);
  const [seconds, setSeconds] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!email) navigate("/signup", { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = window.setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const submitOtp = async (event) => {
    event?.preventDefault();
    if (loading) return;
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the full 6-digit code.");
      inputs.current[otp.findIndex((digit) => !digit)]?.focus();
      return;
    }

    setError("");
    setNotice("");
    setLoading(true);
    try {
      const user = await verifyOtp({ email, code });
      navigate(getPostAuthPath(user), { replace: true });
    } catch (err) {
      setError(err.message || "That code is invalid or has expired. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, value) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setOtp((current) => current.map((digit, position) => position === index ? "" : digit));
      return;
    }
    const next = [...otp];
    digits.slice(0, 6 - index).split("").forEach((digit, offset) => { next[index + offset] = digit; });
    setOtp(next);
    setError("");
    setNotice("");
    inputs.current[Math.min(index + digits.length, 5)]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 5) inputs.current[index + 1]?.focus();
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    setOtp([...pasted.padEnd(6, "").slice(0, 6)]);
    setError("");
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const resendOtp = async () => {
    if (seconds > 0 || resending) return;
    setError("");
    setNotice("");
    setResending(true);
    try {
      await api.resendOtp({ email });
      setSeconds(60);
      setOtp(EMPTY_CODE);
      setNotice("A new verification code has been sent.");
      inputs.current[0]?.focus();
    } catch (err) {
      setError(err.message || "We couldn’t resend the code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const codeInputs = (
    <div className="otp-inputs" onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(element) => { inputs.current[index] = element; }}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          maxLength={1}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Verification code digit ${index + 1}`}
          className={error ? "otp-input otp-input--error" : "otp-input"}
        />
      ))}
    </div>
  );

  const form = (
    <form className="auth-form otp-form" onSubmit={submitOtp}>
      {codeInputs}
      <div className="otp-feedback" aria-live="polite">
        {error && <div className="auth-alert" role="alert">{error}</div>}
        {notice && <div className="auth-notice">{notice}</div>}
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Verifying…" : "Verify email"}</Button>
      <p className="otp-resend">
        Didn’t receive it? {seconds > 0 ? <span>Resend in 0:{String(seconds).padStart(2, "0")}</span> : <button type="button" onClick={resendOtp} disabled={resending}>{resending ? "Sending…" : "Resend code"}</button>}
      </p>
      <button type="button" className="auth-back-link" onClick={() => navigate("/signup")}>← Use a different email</button>
    </form>
  );

  const header = <header className="auth-header"><span className="auth-eyebrow">One last step</span><h1>Verify your email</h1><p>Enter the 6-digit code we sent to <strong>{email || "your email"}</strong>.</p></header>;

  return (
    <main className="auth-page">
      <div className="md:hidden auth-mobile"><StatusSpace /><section className="auth-mobile-content">{header}{form}</section></div>
      <div className="hidden md:flex md:h-full md:w-full"><AuthSidePanel /><section className="auth-desktop-panel"><div className="auth-card">{header}{form}</div></section></div>
    </main>
  );
}
