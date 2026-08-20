import { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import {
  Button,
  StatusSpace,
} from "../components/UI";

import AuthSidePanel from "../components/AuthSidePanel";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const { verifyOtp } = useAuth();

  // Support both:
  // 1. Email passed through navigation state
  // 2. Email passed through URL query parameter
  const email =
    location.state?.email ||
    params.get("email") ||
    "";

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [seconds, setSeconds] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect back to signup if no email is available
  useEffect(() => {
    if (!email) {
      navigate("/signup", {
        replace: true,
      });
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  // Verify OTP
  const submitOtp = async (overrideCode) => {
    const code =
      typeof overrideCode === "string"
        ? overrideCode
        : otp.join("");

    if (!email) {
      setError(
        "Your email is missing. Please return to signup."
      );
      return;
    }

    if (code.length !== 6) {
      setError(
        "Please enter the full 6-digit code."
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const user = await verifyOtp({
        email, code,
      });

      // Redirect according to actual user role
      if (user?.role === "admin") {
        navigate("/admin");
      } else if (user?.role === "artisan") {
        navigate(
          user?.trade
            ? "/artisan/dashboard"
            : "/artisan/build-profile"
        );
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error(
        "OTP verification failed:",
        err
      );

      setError(
        err?.message ||
          "Invalid or expired verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input
  const handleChange = (index, value) => {
    // Only allow one digit
    if (!/^\d?$/.test(value)) {
      return;
    }

    const nextOtp = [...otp];
    nextOtp[index] = value;

    setOtp(nextOtp);
    setError("");

    // Move to next box
    if (value && index < 5) {
      document
        .getElementById(`otp-${index + 1}`)
        ?.focus();
    }

    // Automatically verify after the sixth digit
    if (value && index === 5) {
      const completeCode =
        nextOtp.join("");

      if (completeCode.length === 6) {
        submitOtp(completeCode);
      }
    }
  };

  // Handle backspace
  const handleKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      document
        .getElementById(`otp-${index - 1}`)
        ?.focus();
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (seconds > 0 || loading) {
      return;
    }

    if (!email) {
      setError(
        "Your email is missing. Please return to signup."
      );
      return;
    }

    setError("");

    try {
      await api.resendOtp({ email });

      setSeconds(60);

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      document
        .getElementById("otp-0")
        ?.focus();
    } catch (err) {
      console.error(
        "OTP resend failed:",
        err
      );

      setError(
        err?.message ||
          "Failed to resend verification code."
      );
    }
  };

  // OTP input boxes
  const OtpBoxes = ({ size = 48 }) => (
    <div className="flex gap-2 justify-between">
      {otp.map((digit, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          value={digit}
          onChange={(event) =>
            handleChange(
              index,
              event.target.value
            )
          }
          onKeyDown={(event) =>
            handleKeyDown(
              index,
              event
            )
          }
          maxLength={1}
          inputMode="numeric"
          autoComplete={
            index === 0
              ? "one-time-code"
              : "off"
          }
          style={{
            width: size,
            height: size + 8,
          }}
          className="rounded-[10px] border border-[#1C4CD1] text-center text-[22px] font-bold text-[#1F2937] outline-none focus:border-[#FA7E24]"
        />
      ))}
    </div>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">

      {/* ================= MOBILE ================= */}

      <div className="md:hidden flex flex-col h-full w-full">

        <StatusSpace />

        <div className="flex-1 flex flex-col gap-6 px-6 pt-10">

          <div>
            <h1 className="text-[#1F2937] text-[28px] font-bold leading-[32px]">
              Verify your email
            </h1>

            <p className="text-[#6B7280] text-sm mt-3">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-[#1F2937] break-all">
                {email || "your email"}
              </span>
            </p>
          </div>

          {OtpBoxes({})}

          {error && (
            <p className="text-[#EF4444] text-sm">
              {error}
            </p>
          )}

          <p className="text-[#6B7280] text-sm">
            {seconds > 0 ? (
              <>
                Resend code in{" "}
                <span className="font-bold text-[#1F2937]">
                  00:
                  {String(seconds).padStart(
                    2,
                    "0"
                  )}
                </span>
              </>
            ) : (
              <button
                onClick={resendOtp}
                disabled={loading}
                className="text-[#1C4CD1] font-semibold"
              >
                Resend code now
              </button>
            )}
          </p>

        </div>

        <div className="p-6">
          <Button
            onClick={submitOtp}
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "→ Verify"}
          </Button>
        </div>

      </div>

      {/* ================= DESKTOP ================= */}

      <div className="hidden md:flex md:h-full md:w-full">

        <AuthSidePanel />

        <div className="w-1/2 flex items-center justify-center px-16">

          <div className="w-full max-w-[420px] flex flex-col gap-6">

            <div>
              <h1 className="text-[#1F2937] text-[32px] font-bold">
                Verify your email
              </h1>

              <p className="text-[#6B7280] text-base mt-1">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-[#1F2937] break-all">
                  {email || "your email"}
                </span>
              </p>
            </div>

            {OtpBoxes({ size: 56 })}

            {error && (
              <p className="text-[#EF4444] text-sm">
                {error}
              </p>
            )}

            <Button
              onClick={submitOtp}
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "→ Verify"}
            </Button>

            <p className="text-[#6B7280] text-sm text-center">
              {seconds > 0 ? (
                <>
                  Resend code in{" "}
                  <span className="font-bold text-[#1F2937]">
                    00:
                    {String(seconds).padStart(
                      2,
                      "0"
                    )}
                  </span>
                </>
              ) : (
                <button
                  onClick={resendOtp}
                  disabled={loading}
                  className="text-[#1C4CD1] font-semibold"
                >
                  Resend code now
                </button>
              )}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
