import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, StatusSpace, TextInput } from "../components/UI";
import Logo from "../components/Logo";
import { api } from "../lib/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setMessage("");
    if (!email) {
      setError("Enter the email on your account.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.forgotPassword(email);
      setMessage(res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Form = () => (
    <>
      <TextInput label="Email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      {message && <p className="text-[#22C55E] text-sm">{message}</p>}
      {error && <p className="text-[#EF4444] text-sm">{error}</p>}
    </>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center gap-3 px-6 pt-2">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
        </div>
        <div className="flex-1 flex flex-col gap-4 px-6 pt-6">
          <h1 className="text-[#1F2937] text-[28px] font-bold">Reset Password</h1>
          <p className="text-[#6B7280] text-sm -mt-2">
            Enter your account email and we'll send reset instructions.
          </p>
          {Form()}
          <Button onClick={submit} disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:h-full md:w-full">
        <div className="w-1/2 bg-[#0F2A44] flex flex-col justify-center px-16 gap-6">
          <Logo size={56} wordmarkClass="text-white" />
          <div className="h-[280px] rounded-2xl bg-white/10" />
        </div>
        <div className="w-1/2 flex items-center justify-center px-16">
          <div className="w-full max-w-[400px] flex flex-col gap-5">
            <h1 className="text-[#1F2937] text-[32px] font-bold">Reset Password</h1>
            <p className="text-[#6B7280] text-sm -mt-2">
              Enter your account email and we'll send reset instructions.
            </p>
            {Form()}
            <Button onClick={submit} disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</Button>
            <button onClick={() => navigate("/login")} className="text-[#0F2A44] text-sm font-semibold self-center">
              Back to Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
