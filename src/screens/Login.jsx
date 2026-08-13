import { useNavigate } from "react-router-dom";
import { Button, StatusSpace, TextInput } from "../components/UI";
import Logo from "../components/Logo";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col gap-4 px-6 pt-[39px]">
          <h1 className="text-[#1F2937] text-[32px] font-bold leading-[38.4px]">
            Welcome Back
          </h1>
          <div className="h-2" />
          <TextInput label="Email or Phone Number" placeholder="you@example.com" type="text" />
          <TextInput label="Password" placeholder="••••••••" type="password" />
          <div className="flex justify-end -mt-2">
            <button className="text-[#6B7280] text-sm">Forgot Password?</button>
          </div>
          <div className="h-2" />
          <Button onClick={() => navigate("/home")}>Login</Button>
          <div className="flex gap-1.5 items-center justify-center pt-2">
            <span className="text-[#6B7280] text-sm">Don&apos;t have an account?</span>
            <button onClick={() => navigate("/signup")} className="text-[#0F2A44] text-sm font-semibold">
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:h-full md:w-full">
        <div className="w-1/2 bg-[#0F2A44] flex flex-col justify-center px-16 gap-6">
          <Logo size={56} wordmarkClass="text-white" />
          <div className="h-[280px] rounded-2xl bg-white/10" />
          <p className="text-white text-2xl font-semibold leading-snug max-w-[420px]">
            Verified artisans, Escrow-protected jobs. No wahala.
          </p>
        </div>
        <div className="w-1/2 flex items-center justify-center px-16">
          <div className="w-full max-w-[400px] flex flex-col gap-5">
            <h1 className="text-[#1F2937] text-[32px] font-bold">Welcome Back</h1>
            <TextInput label="Email or Phone Number" placeholder="you@example.com" type="text" />
            <TextInput label="Password" placeholder="••••••••" type="password" />
            <div className="flex justify-end -mt-2">
              <button className="text-[#6B7280] text-sm">Forgot Password?</button>
            </div>
            <Button onClick={() => navigate("/home")}>Log In</Button>
            <div className="flex gap-1.5 items-center justify-center pt-2">
              <span className="text-[#6B7280] text-sm">Don&apos;t have an account?</span>
              <button onClick={() => navigate("/signup")} className="text-[#0F2A44] text-sm font-semibold">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
