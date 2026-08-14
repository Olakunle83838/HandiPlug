// Shared design-system primitives for HandiPlug
// Colors: navy #0F2A44 · orange #FF7A00 · text #1F2937 · caption #6B7280
// border #E5E7EB · surface #F5F6F8 · success #22C55E · star #FACC15

export function StatusSpace() {
  return <div className="h-[54px] w-full shrink-0 md:hidden" />;
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "h-[52px] w-full rounded-[10px] flex items-center justify-center font-bold text-[16px] transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  const variants = {
    primary: "bg-[#FF7A00] text-white hover:bg-[#e66e00]",
    dark: "bg-[#0F2A44] text-white hover:bg-[#0c2236]",
    outline: "bg-white text-[#0F2A44] border border-[#E5E7EB] hover:bg-[#F5F6F8]",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl p-3.5 shadow-[0px_4px_12px_0px_rgba(15,42,68,0.1)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Avatar({ size = 56, emoji = "👤" }) {
  return (
    <div
      className="rounded-full bg-[#F5F6F8] flex items-center justify-center shrink-0 text-[#9CA3AF]"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {emoji}
    </div>
  );
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-[#22C55E]/12 bg-[rgba(34,197,94,0.12)] text-[#22C55E] text-xs font-semibold px-2.5 py-1 whitespace-nowrap">
      ✓ Verified
    </span>
  );
}

export function Stars({ rating = 5 }) {
  const full = Math.round(rating);
  return (
    <span className="text-[#FACC15] text-sm tracking-[2px]">
      {"★".repeat(full)}
      {"☆".repeat(5 - full)}
    </span>
  );
}

export function Chip({ children, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 h-[33px] rounded-full text-sm font-medium whitespace-nowrap transition ${
        active
          ? "bg-[#0F2A44] text-white"
          : "bg-[#F5F6F8] text-[#6B7280] hover:bg-[#e9ebef]"
      }`}
    >
      {children}
    </button>
  );
}

export function Label({ children }) {
  return (
    <p className="text-[12px] font-bold tracking-[0.2px] text-[#6B7280] uppercase">
      {children}
    </p>
  );
}

export function TextInput({ label, icon, ...props }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-[10px] h-[52px] px-[17px] w-full focus-within:border-[#FF7A00]">
        {icon && <span className="text-base shrink-0">{icon}</span>}
        <input
          className="w-full outline-none text-[16px] text-[#1F2937] placeholder:text-[#9CA3AF] bg-transparent"
          {...props}
        />
      </div>
    </div>
  );
}

export function TopBar({ title, onBack }) {
  return (
    <div className="flex items-center gap-3 px-6 pt-4 pb-2 w-full">
      {onBack && (
        <button onClick={onBack} className="text-2xl text-[#1F2937] leading-none">
          ‹
        </button>
      )}
      <h1 className="text-[22px] font-bold text-[#1F2937]">{title}</h1>
    </div>
  );
}

export function TogglePill({ options, active, onChange }) {
  return (
    <div className="bg-[#F5F6F8] rounded-full p-1 flex w-full">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 h-[37px] rounded-full text-sm font-semibold transition ${
            active === opt ? "bg-[#0F2A44] text-white" : "text-[#6B7280]"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
