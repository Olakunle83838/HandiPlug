import { useNavigate } from "react-router-dom";
import { Button } from "../components/UI";
import Logo from "../components/Logo";

export default function Splash() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#0F2A44] flex flex-col items-center h-full w-full">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-10">
        <Logo size={200} showWordmark={false} />
        <p className="text-white/70 font-bold text-base text-center">
          Artisan Problems, We go Solve am
        </p>
      </div>
      <div className="w-full px-6 pb-[60px]">
        <Button onClick={() => navigate("/onboarding")}>Get Started</Button>
      </div>
    </div>
  );
}
