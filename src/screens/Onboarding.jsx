import { useNavigate } from "react-router-dom";
import { Button, StatusSpace } from "../components/UI";

export default function Onboarding() {
  const navigate = useNavigate();
  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* Onboarding is a mobile-only concept (desktop users land on the
          marketing homepage instead), so this screen keeps a simple
          centered desktop fallback in case it's reached directly. */}
      <StatusSpace />
      <div className="px-6 md:hidden">
        <div className="h-[420px] w-full rounded-2xl bg-[#F5F6F8] bg-[url('https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=600&auto=format&fit=crop')] bg-cover bg-center" />
      </div>
      <div className="flex-1 flex flex-col gap-3 pt-8 px-6 md:hidden">
        <p className="text-[#FF7A00] text-xs font-medium tracking-[1px]">
          VERIFIED · TRUSTED · LOCAL
        </p>
        <h1 className="text-[#1F2937] text-2xl font-bold leading-[30px]">
          Find skilled artisans you can trust.
        </h1>
        <div className="flex gap-2 items-center pt-2">
          <span className="size-2 rounded-full bg-[#E5E7EB]" />
          <span className="h-2 w-5 rounded-full bg-[#FF7A00]" />
          <span className="size-2 rounded-full bg-[#E5E7EB]" />
        </div>
      </div>
      <div className="p-6 md:hidden">
        <Button onClick={() => navigate("/login")}>Continue</Button>
      </div>

      {/* Desktop fallback */}
      <div className="hidden md:flex md:flex-1 md:items-center md:justify-center md:flex-col md:gap-6 md:px-6">
        <p className="text-[#FF7A00] text-xs font-bold tracking-[1px]">VERIFIED · TRUSTED · LOCAL</p>
        <h1 className="text-[#1F2937] text-3xl font-bold text-center max-w-[500px]">
          Find skilled artisans you can trust.
        </h1>
        <Button className="max-w-[300px]" onClick={() => navigate("/login")}>
          Continue
        </Button>
      </div>
    </div>
  );
}
