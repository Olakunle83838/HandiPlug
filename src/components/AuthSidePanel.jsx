import Logo from "./Logo";

/**
 * The blue side panel used on desktop auth screens (Signup, OTP, ...).
 * Matches the Figma design exactly: icon + wordmark header, headline,
 * quote, and a copyright footer pinned to the bottom.
 */
export default function AuthSidePanel() {
  return (
    <div className="w-1/2 bg-[#1C4CD1] flex flex-col justify-between px-16 py-16">
      <div className="flex items-center gap-3">
        <Logo size={40} variant="icon" />
        <span className="text-white font-extrabold text-xl">HandiPlug</span>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-white text-[32px] font-bold leading-[1.2]">
          Verified artisans.
          <br />
          Escrow-protected jobs.
          <br />
          No wahala.
        </h2>
        <p className="text-white/80 text-base leading-relaxed max-w-[420px]">
          "E don set!" — join thousands of Lagosians booking trusted
          electricians, plumbers and carpenters every day.
        </p>
      </div>

      <p className="text-white/60 text-sm">© HandiPlug — Lagos, Nigeria</p>
    </div>
  );
}
