import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, StatusSpace, TextInput, TogglePill } from "../components/UI";

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("I'm a Customer");

  return (
    <div className="bg-white flex flex-col h-full w-full overflow-y-auto">
      <StatusSpace />
      <div className="flex flex-col gap-4 px-6 pt-[39px] pb-6">
        <h1 className="text-[#1F2937] text-[32px] font-bold leading-[39px]">
          Create Account
        </h1>
        <p className="text-[#6B7280] text-sm -mt-2">
          Join the Lagos&rsquo;s trusted artisan community
        </p>

        <TogglePill
          options={["I'm a Customer", "I'm an Artisan"]}
          active={role}
          onChange={setRole}
        />

        <TextInput label="Full Name" placeholder="Full name" />
        <TextInput label="Email" placeholder="you@example.com" />
        <TextInput label="Phone Number" placeholder="+234 800 000 0000" />
        <TextInput label="Password" placeholder="••••••••" type="password" />
        <TextInput label="Home Address" placeholder="Lagos Island, Lagos State" />

        <Button className="mt-2" onClick={() => navigate(`/otp?role=${role === "I'm an Artisan" ? "artisan" : "customer"}`)}>
          Create Account
        </Button>
      </div>
    </div>
  );
}
