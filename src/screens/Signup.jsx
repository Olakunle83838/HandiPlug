import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, StatusSpace, TextInput, TogglePill } from "../components/UI";
import AuthSidePanel from "../components/AuthSidePanel";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState("I need a service");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const submit = async () => {
  setError("");

  if (!fullName || !email || !phone || !password) {
    setError("Please fill in all required fields (Full name, Email, Phone, Password).");
    return;
  }

  setLoading(true);

  try {
    const isArtisan = role === "I offer a service";

    await register({
      fullName,
      email,
      phone,
      password,
      address: homeAddress,
      role: isArtisan ? "artisan" : "customer",
    });

    navigate(`/otp?role=${isArtisan ? "artisan" : "customer"}`, {
      state: { email },
    });
  } catch (err) {
    setError(err.message || "Failed to create account or send verification code.");
  } finally {
    setLoading(false);
  }
};

  const Form = () => (
    <>
      <TogglePill variant="chip" options={["I need a service", "I offer a service"]} active={role} onChange={setRole} />
      <TextInput
        plainLabel
        label="Full name"
        icon="👤"
        placeholder="Enter your full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        />

      <TextInput
        plainLabel
        label="Email address"
        icon="📧"
        placeholder="example@email.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextInput
        plainLabel
        label="Phone number"
        icon="📞"
        placeholder="080X XXX XXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <TextInput
        plainLabel
        label="Home address"
        icon="🏠"
        placeholder="Enter your home address"
        value={homeAddress}
        onChange={(e) => setHomeAddress(e.target.value)}
      />

      <TextInput
        plainLabel
        label="Password"
        icon="🔒"
        placeholder="••••••••"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />

      {error && <p className="text-[#EF4444] text-sm">{error}</p>}
    </> 
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full overflow-y-auto">
        <StatusSpace />
        <div className="flex flex-col gap-4 px-6 pt-[39px] pb-6">
          <h1 className="text-[#1F2937] text-[32px] font-bold leading-[39px]">Create your account</h1>
          <p className="text-[#6B7280] text-sm -mt-2">Join Lagos's trusted artisan community.</p>
          {Form()}
          <Button className="mt-2" onClick={submit} disabled={loading}>
            {loading ? "Creating account..." : "→ Continue"}
          </Button>
          <div className="flex gap-1.5 items-center justify-center pt-1">
            <span className="text-[#6B7280] text-sm">Already have an account?</span>
            <button onClick={() => navigate("/login")} className="text-[#1C4CD1] text-sm font-semibold">Log in</button>
          </div>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:h-full md:w-full">
        <AuthSidePanel />
        <div className="w-1/2 flex items-center justify-center px-16">
          <div className="w-full max-w-[440px] flex flex-col gap-5">
            <div>
              <h1 className="text-[#1F2937] text-[32px] font-bold">Create your account</h1>
              <p className="text-[#6B7280] text-base mt-1">Join Lagos's trusted artisan community.</p>
            </div>
            {Form()}
            <Button className="mt-1" onClick={submit} disabled={loading}>
              {loading ? "Creating account..." : "→ Continue"}
            </Button>
            <div className="flex gap-1.5 items-center justify-center">
              <span className="text-[#6B7280] text-sm">Already have an account?</span>
              <button onClick={() => navigate("/login")} className="text-[#1C4CD1] text-sm font-semibold">Log in</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
