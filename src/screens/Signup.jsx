import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, StatusSpace, TextInput, TogglePill } from "../components/UI";
import Logo from "../components/Logo";

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("I'm a Customer");

  const goNext = () =>
    navigate(`/otp?role=${role === "I'm an Artisan" ? "artisan" : "customer"}`);

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full overflow-y-auto">
        <StatusSpace />
        <div className="flex flex-col gap-4 px-6 pt-[39px] pb-6">
          <h1 className="text-[#1F2937] text-[32px] font-bold leading-[39px]">Create Account</h1>
          <p className="text-[#6B7280] text-sm -mt-2">Join the Lagos&rsquo;s trusted artisan community</p>
          <TogglePill options={["I'm a Customer", "I'm an Artisan"]} active={role} onChange={setRole} />
          <TextInput label="Full Name" placeholder="Full name" />
          <TextInput label="Email" placeholder="you@example.com" />
          <TextInput label="Phone Number" placeholder="+234 800 000 0000" />
          <TextInput label="Password" placeholder="••••••••" type="password" />
          <TextInput label="Home Address" placeholder="Lagos Island, Lagos State" />
          <Button className="mt-2" onClick={goNext}>Create Account</Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:h-full md:w-full">
        <div className="w-1/2 bg-[#0F2A44] flex flex-col justify-center px-16 gap-6">
          <Logo size={56} wordmarkClass="text-white" />
          <div className="h-[280px] rounded-2xl bg-white/10" />
          <p className="text-white text-2xl font-semibold leading-snug max-w-[420px]">
            "E don set!" — Join thousands of Lagosians booking trusted
            electricians, plumbers and carpenters everyday.
          </p>
        </div>
        <div className="w-1/2 overflow-y-auto flex items-center justify-center px-16 py-10">
          <div className="w-full max-w-[440px] flex flex-col gap-5">
            <h1 className="text-[#1F2937] text-[32px] font-bold">Create your account</h1>
            <p className="text-[#6B7280] text-sm -mt-2">Join Lagos&rsquo;s trusted artisan community</p>
            <TogglePill options={["I'm a Customer", "I'm an Artisan"]} active={role} onChange={setRole} />
            <div className="grid grid-cols-2 gap-4">
              <TextInput label="Full Name" placeholder="Full name" />
              <TextInput label="Phone Number" placeholder="080X XX XXX XXX" />
            </div>
            <TextInput label="Password" placeholder="••••••••" type="password" />
            <TextInput label="Home Address" placeholder="Lagos Island, Lagos State" />
            <Button className="mt-2" onClick={goNext}>Continue</Button>
            <div className="flex gap-1.5 items-center justify-center pt-1">
              <span className="text-[#6B7280] text-sm">Already have an account?</span>
              <button onClick={() => navigate("/login")} className="text-[#0F2A44] text-sm font-semibold">
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
