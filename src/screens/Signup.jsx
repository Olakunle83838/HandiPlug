import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, StatusSpace, TextInput, TogglePill } from "../components/UI";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState("I'm a Customer");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", address: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async () => {
    setError("");
    if (!form.fullName || !form.email || !form.password) {
      setError("Please fill in your name, email and password.");
      return;
    }
    setLoading(true);
    try {
      const isArtisan = role === "I'm an Artisan";
      await register({
        ...form,
        role: isArtisan ? "artisan" : "customer",
      });
      navigate(`/otp?role=${isArtisan ? "artisan" : "customer"}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Form = () => (
    <>
      <TextInput label="Full Name" placeholder="Full name" value={form.fullName} onChange={update("fullName")} />
      <TextInput label="Email" placeholder="you@example.com" value={form.email} onChange={update("email")} />
      <TextInput label="Phone Number" placeholder="+234 800 000 0000" value={form.phone} onChange={update("phone")} />
      <TextInput label="Password" placeholder="At least 6 characters" type="password" value={form.password} onChange={update("password")} />
      <TextInput label="Home Address" placeholder="Lagos Island, Lagos State" value={form.address} onChange={update("address")} />
    </>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full overflow-y-auto">
        <StatusSpace />
        <div className="flex flex-col gap-4 px-6 pt-[39px] pb-6">
          <h1 className="text-[#1F2937] text-[32px] font-bold leading-[39px]">Create Account</h1>
          <p className="text-[#6B7280] text-sm -mt-2">Join the Lagos&rsquo;s trusted artisan community</p>
          <TogglePill options={["I'm a Customer", "I'm an Artisan"]} active={role} onChange={setRole} />
          {Form()}
          {error && <p className="text-[#EF4444] text-sm">{error}</p>}
          <Button className="mt-2" onClick={submit} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
          <div className="flex gap-1.5 items-center justify-center pt-1">
            <span className="text-[#6B7280] text-sm">Already have an account?</span>
            <button onClick={() => navigate("/login")} className="text-[#0F2A44] text-sm font-semibold">Log In</button>
          </div>
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
              <TextInput label="Full Name" placeholder="Full name" value={form.fullName} onChange={update("fullName")} />
              <TextInput label="Phone Number" placeholder="080X XX XXX XXX" value={form.phone} onChange={update("phone")} />
            </div>
            <TextInput label="Email" placeholder="you@example.com" value={form.email} onChange={update("email")} />
            <TextInput label="Password" placeholder="At least 6 characters" type="password" value={form.password} onChange={update("password")} />
            <TextInput label="Home Address" placeholder="Lagos Island, Lagos State" value={form.address} onChange={update("address")} />
            {error && <p className="text-[#EF4444] text-sm">{error}</p>}
            <Button className="mt-2" onClick={submit} disabled={loading}>
              {loading ? "Creating account..." : "Continue"}
            </Button>
            <div className="flex gap-1.5 items-center justify-center pt-1">
              <span className="text-[#6B7280] text-sm">Already have an account?</span>
              <button onClick={() => navigate("/login")} className="text-[#0F2A44] text-sm font-semibold">Log In</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
