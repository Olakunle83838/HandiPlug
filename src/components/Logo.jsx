import logoImg from "../assets/logo.png";

export default function Logo({ size = 40, showWordmark = false, wordmarkClass = "text-[#0F2A44]" }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={logoImg}
        alt="HandiPlug"
        style={{ height: size, width: "auto", maxWidth: "100%", objectFit: "contain" }}
      />
      {showWordmark && (
        <span className={`font-extrabold text-xl tracking-tight ${wordmarkClass}`}>
          Handi<span className="text-[#FF7A00]">Plug</span>
        </span>
      )}
    </div>
  );
}


