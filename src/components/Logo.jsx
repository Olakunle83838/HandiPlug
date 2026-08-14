import defaultLogoImg from "../assets/logo.png";
import { useBrand } from "../context/BrandContext";

/**
 * Renders the uploaded custom logo if one has been set via Brand Settings
 * (/brand), otherwise falls back to the bundled placeholder file at
 * src/assets/logo.png. Sized by height; width scales automatically so it
 * never stretches regardless of the uploaded file's aspect ratio.
 */
export default function Logo({ size, showWordmark = false, wordmarkClass = "text-[#0F2A44]" }) {
  const { logoSrc, logoHeight } = useBrand();
  const height = size ?? logoHeight;

  return (
    <div className="flex items-center gap-2">
      <img
        src={logoSrc || defaultLogoImg}
        alt="HandiPlug"
        style={{ height, width: "auto", maxWidth: "100%", objectFit: "contain" }}
      />
      {showWordmark && (
        <span className={`font-extrabold text-xl tracking-tight ${wordmarkClass}`}>
          Handi<span className="text-[#FF7A00]">Plug</span>
        </span>
      )}
    </div>
  );
}
