export default function Logo({ size = 40, showWordmark = true, wordmarkClass = "text-[#0F2A44]" }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M28 8c-2 4-2 8 0 11l8 10c2.5 3-.5 7-3.5 5L18 24c-3-2-5-6-3-11 1.4-3.5 4.6-5.6 8-6.5"
          stroke="#FF7A00"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M36 56c2-4 2-8 0-11l-8-10c-2.5-3 .5-7 3.5-5L46 40c3 2 5 6 3 11-1.4 3.5-4.6 5.6-8 6.5"
          stroke="#1E3A8A"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showWordmark && (
        <span className={`font-extrabold text-xl tracking-tight ${wordmarkClass}`}>
          Handi<span className="text-[#FF7A00]">Plug</span>
        </span>
      )}
    </div>
  );
}
