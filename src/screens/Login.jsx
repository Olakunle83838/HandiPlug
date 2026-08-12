import { useNavigate } from "react-router-dom";
import { Button, StatusSpace, TextInput } from "../components/UI";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="bg-white flex flex-col h-full w-full">
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
          <button
            onClick={() => navigate("/signup")}
            className="text-[#0F2A44] text-sm font-semibold"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
