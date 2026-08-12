import { useNavigate } from "react-router-dom";
import { Button, StatusSpace } from "../components/UI";

export default function Onboarding() {
  const navigate = useNavigate();
  return (
    <div className="bg-white flex flex-col h-full w-full">
      <StatusSpace />
      <div className="px-6">
        <div className="h-[420px] w-full rounded-2xl bg-[#F5F6F8] bg-[url('https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=600&auto=format&fit=crop')] bg-cover bg-center" />
      </div>
      <div className="flex-1 flex flex-col gap-3 pt-8 px-6">
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
      <div className="p-6">
        <Button onClick={() => navigate("/login")}>Continue</Button>
      </div>
    </div>
  );
}
