// Extra shared primitives used only in desktop layouts.
import { useNavigate } from "react-router-dom";
import { Avatar, VerifiedBadge, Stars } from "./UI";

export function ArtisanCardDesktop({ artisan, onView }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col gap-4 w-[320px] shrink-0">
      <div className="flex items-center justify-between">
        <Avatar size={48} />
        {artisan.verified && <VerifiedBadge />}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[#1F2937] text-lg font-semibold">{artisan.name}</p>
        <p className="text-[#6B7280] text-sm">
          {artisan.trade} · {artisan.area}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <Stars rating={artisan.rating} />
        <span className="text-[#6B7280] text-sm">from {artisan.price}</span>
      </div>
      {onView !== false && (
        <button
          onClick={() => (onView ? onView() : navigate("/artisan-profile"))}
          className="h-9 rounded-[8px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold hover:bg-[#F5F6F8]"
        >
          View Profile
        </button>
      )}
    </div>
  );
}

export function CategoryTile({ icon, label, big = false, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 shrink-0">
      <div
        className={`bg-[#F5F6F8] rounded-2xl flex items-center justify-center ${
          big ? "size-16 text-3xl" : "size-[52px] text-2xl"
        }`}
      >
        {icon}
      </div>
      <span className="text-[#6B7280] text-sm">{label}</span>
    </button>
  );
}

export function StatusPill({ status }) {
  const styles = {
    Accepted: "bg-[#22C55E]/12 bg-[rgba(34,197,94,0.12)] text-[#22C55E]",
    Completed: "bg-[#22C55E]/12 bg-[rgba(34,197,94,0.12)] text-[#22C55E]",
    Pending: "bg-[#FF7A00]/12 bg-[rgba(255,122,0,0.12)] text-[#FF7A00]",
    Cancelled: "bg-[#EF4444]/12 bg-[rgba(239,68,68,0.12)] text-[#EF4444]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full text-xs font-semibold px-3 py-1 whitespace-nowrap ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
}

export function PendingBadge({ children = "⏳ Pending Review" }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#FF7A00]/12 bg-[rgba(255,122,0,0.12)] text-[#FF7A00] text-xs font-semibold px-3 py-1 whitespace-nowrap">
      {children}
    </span>
  );
}

// Simple table primitives so desktop tables share one visual language.
export function Table({ children }) {
  return <div className="w-full border border-[#E5E7EB] rounded-2xl overflow-hidden">{children}</div>;
}
export function THead({ columns }) {
  return (
    <div className="flex bg-[#F5F6F8] border-b border-[#E5E7EB]">
      {columns.map((c) => (
        <div
          key={c.label}
          className={`px-4 h-[38px] flex items-center text-[#6B7280] text-xs font-semibold ${c.className || "flex-1"}`}
        >
          {c.label}
        </div>
      ))}
    </div>
  );
}
export function TRow({ children }) {
  return <div className="flex items-center border-b border-[#E5E7EB] last:border-b-0">{children}</div>;
}
export function TCell({ children, className = "flex-1" }) {
  return <div className={`px-4 py-4 ${className}`}>{children}</div>;
}
