import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, StatusSpace, TextInput } from "../components/UI";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "artisan") navigate("/artisan/dashboard");
      else navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Form = () => (
    <>
      <TextInput label="Email or Phone Number" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextInput label="Password" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
      <div className="flex justify-end -mt-2">
        <button onClick={() => navigate("/forgot-password")} className="text-[#6B7280] text-sm">Forgot Password?</button>
      </div>
      {error && <p className="text-[#EF4444] text-sm">{error}</p>}
    </>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col gap-4 px-6 pt-[39px]">
          <h1 className="text-[#1F2937] text-[32px] font-bold leading-[38.4px]">Welcome Back</h1>
          <div className="h-2" />
          {Form()}
          <div className="h-2" />
          <Button onClick={submit} disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
          <div className="flex gap-1.5 items-center justify-center pt-2">
            <span className="text-[#6B7280] text-sm">Don&apos;t have an account?</span>
            <button onClick={() => navigate("/signup")} className="text-[#1C4CD1] text-sm font-semibold">Create Account</button>
          </div>
          <div className="border-t border-[#E5E7EB] mt-4 pt-4">
            <p className="text-[#9CA3AF] text-xs text-center">
              Demo logins — Admin: admin@handiplug.ng / admin1234 · Artisan: ifeanyi@handiplug.ng / password123
            </p>
          </div>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:h-full md:w-full">
        <div className="w-1/2 bg-[#1C4CD1] flex flex-col justify-center px-16 gap-6">
          <Logo size={56} wordmarkClass="text-white" />
          <div className="h-[280px] rounded-2xl bg-white/10" />
          <p className="text-white text-2xl font-semibold leading-snug max-w-[420px]">
            Verified artisans, Escrow-protected jobs. No wahala.
          </p>
        </div>
        <div className="w-1/2 flex items-center justify-center px-16">
          <div className="w-full max-w-[400px] flex flex-col gap-5">
            <h1 className="text-[#1F2937] text-[32px] font-bold">Welcome Back</h1>
            {Form()}
            <Button onClick={submit} disabled={loading}>{loading ? "Logging in..." : "Log In"}</Button>
            <div className="flex gap-1.5 items-center justify-center pt-2">
              <span className="text-[#6B7280] text-sm">Don&apos;t have an account?</span>
              <button onClick={() => navigate("/signup")} className="text-[#1C4CD1] text-sm font-semibold">Sign Up</button>
            </div>
            <div className="border-t border-[#E5E7EB] mt-2 pt-4">
              <p className="text-[#9CA3AF] text-xs text-center">
                Demo logins — Admin: admin@handiplug.ng / admin1234 · Artisan: ifeanyi@handiplug.ng / password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
