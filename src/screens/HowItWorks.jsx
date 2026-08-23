import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Button } from "../components/UI";
import TopNav from "../components/TopNav";

const CUSTOMER_STEPS = [
  {
    title: "Search by trade & location",
    body: "Tell us what you need — electrician, plumber, carpenter — and where. HandiPlug shows artisans near you, filtered by rating and price.",
    icon: "🔍",
  },
  {
    title: "Compare verified profiles",
    body: "Every listed artisan has an ID-verified profile, a visible price range, and real reviews from past jobs — so you're never hiring blind.",
    icon: "🛡️",
  },
  {
    title: "Book & chat in-app",
    body: "Request a date and time, then message the artisan directly to confirm details. No more chasing phone calls or losing the thread.",
    icon: "📅",
  },
  {
    title: "Get the job done, then review",
    body: "Once the work's complete, rate and review the artisan. Your review helps the next customer make an informed choice.",
    icon: "⭐",
  },
];

const ARTISAN_STEPS = [
  {
    title: "Sign up & verify your ID",
    body: "Create your account, then submit your NIN, a valid ID, and a quick facial scan. Verification is what earns you the trust badge customers look for.",
    icon: "📝",
  },
  {
    title: "Build your storefront",
    body: "Add your trade, years of experience, hourly rate, and portfolio photos of past work — this is what customers see before they book.",
    icon: "🧰",
  },
  {
    title: "Get discovered & booked",
    body: "Once verified, you appear in search results for your trade and area. Customers send booking requests straight to you.",
    icon: "📣",
  },
  {
    title: "Message, complete jobs, get reviewed",
    body: "Confirm details in-app, do the job, and collect reviews. A growing reputation means more bookings and the ability to charge fairly.",
    icon: "📈",
  },
];

function StepCard({ step, index, accentBg }) {
  return (
    <div className="flex gap-4 border border-[#E5E7EB] rounded-2xl p-5">
      <div className="shrink-0 flex flex-col items-center gap-2">
        <div className={`size-12 rounded-2xl flex items-center justify-center text-2xl ${accentBg}`}>
          {step.icon}
        </div>
        <span className="text-[#9CA3AF] text-xs font-bold">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div>
        <h3 className="text-[#1F2937] text-base font-bold mb-1">{step.title}</h3>
        <p className="text-[#6B7280] text-sm leading-6">{step.body}</p>
      </div>
    </div>
  );
}

function TabToggle({ tab, setTab }) {
  return (
    <div className="bg-[#F5F6F8] rounded-[12px] p-1.5 flex gap-1">
      <button
        onClick={() => setTab("customer")}
        className={`flex-1 rounded-[9px] h-10 text-sm font-semibold transition-colors ${
          tab === "customer" ? "bg-[#1C4CD1] text-white" : "text-[#6B7280]"
        }`}
      >
        I need an artisan
      </button>
      <button
        onClick={() => setTab("artisan")}
        className={`flex-1 rounded-[9px] h-10 text-sm font-semibold transition-colors ${
          tab === "artisan" ? "bg-[#FF7A00] text-white" : "text-[#6B7280]"
        }`}
      >
        I am an artisan
      </button>
    </div>
  );
}

function TrustCallout() {
  return (
    <div className="bg-[#F5F6F8] rounded-2xl p-6 flex flex-col gap-3">
      <span className="text-3xl">🛡️</span>
      <h2 className="text-[#1F2937] text-base font-bold">Verification isn't optional — it's the point.</h2>
      <p className="text-[#6B7280] text-sm leading-6">
        Every artisan on HandiPlug submits a valid ID, a facial scan, and two guarantors
        before they can appear in search. It's why customers can hire with confidence,
        and why verified artisans win more jobs.
      </p>
    </div>
  );
}

export default function HowItWorks() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("customer");
  const steps = tab === "customer" ? CUSTOMER_STEPS : ARTISAN_STEPS;
  const accentBg = tab === "customer" ? "bg-[#EEF2FF]" : "bg-[#FFF1E6]";

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center gap-3 px-6 pt-2">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
          <h1 className="text-[#1F2937] text-xl font-bold">How It Works</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-4 flex flex-col gap-5 pb-4">
          <p className="text-[#6B7280] text-sm leading-6">
            HandiPlug replaces word-of-mouth and roadside signage with verified profiles,
            transparent pricing, and structured booking — for both sides of the job.
          </p>

          <TabToggle tab={tab} setTab={setTab} />

          <div className="flex flex-col gap-3">
            {steps.map((step, i) => (
              <StepCard key={step.title} step={step} index={i} accentBg={accentBg} />
            ))}
          </div>

          <TrustCallout />
        </div>
        <div className="p-6 pt-2 flex flex-col gap-3">
          <Button onClick={() => navigate("/search")}>Find an artisan</Button>
          <button
            onClick={() => navigate("/signup")}
            className="h-12 rounded-[10px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold"
          >
            Become an artisan
          </button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="guest" />
        <div className="flex-1 overflow-y-auto">
          <div className="bg-[#1C4CD1] px-12 py-16">
            <div className="max-w-[720px] mx-auto text-center flex flex-col items-center gap-4">
              <h1 className="text-white text-[36px] font-bold leading-tight">
                From "who do I even call?" to booked — in four steps.
              </h1>
              <p className="text-white/85 text-base max-w-[560px]">
                HandiPlug replaces word-of-mouth and roadside signage with verified profiles,
                transparent pricing, and structured booking — for both sides of the job.
              </p>
            </div>
          </div>

          <div className="max-w-[960px] mx-auto px-12 -mt-6">
            <div className="bg-white border border-[#E5E7EB] rounded-[14px] p-1.5 flex gap-1 shadow-sm max-w-[420px] mx-auto">
              <button
                onClick={() => setTab("customer")}
                className={`flex-1 rounded-[10px] h-11 text-sm font-semibold transition-colors ${
                  tab === "customer" ? "bg-[#1C4CD1] text-white" : "text-[#6B7280]"
                }`}
              >
                I need an artisan
              </button>
              <button
                onClick={() => setTab("artisan")}
                className={`flex-1 rounded-[10px] h-11 text-sm font-semibold transition-colors ${
                  tab === "artisan" ? "bg-[#FF7A00] text-white" : "text-[#6B7280]"
                }`}
              >
                I am an artisan
              </button>
            </div>
          </div>

          <div className="max-w-[960px] mx-auto px-12 py-14">
            <div className="grid grid-cols-2 gap-6">
              {steps.map((step, i) => (
                <StepCard key={step.title} step={step} index={i} accentBg={accentBg} />
              ))}
            </div>
          </div>

          <div className="max-w-[960px] mx-auto px-12 pb-14">
            <TrustCallout />
          </div>

          <div className="max-w-[960px] mx-auto px-12 pb-16 flex gap-4 justify-center">
            <button
              onClick={() => navigate("/search")}
              className="bg-[#1C4CD1] text-white text-sm font-semibold rounded-[10px] h-12 px-8"
            >
              Find an artisan
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-[#FF7A00] text-white text-sm font-semibold rounded-[10px] h-12 px-8"
            >
              Become an artisan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}