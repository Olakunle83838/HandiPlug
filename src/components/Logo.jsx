import fullLogo from "../assets/logo.png";
import iconLogo from "../assets/logo-icon.png";

/**
 * The HandiPlug logo. Plain static asset, controlled entirely in code —
 * no admin panel, no upload flow. To change it: replace
 * src/assets/logo.png (full icon+wordmark lockup) and/or
 * src/assets/logo-icon.png (circular icon only, used in compact nav bars).
 *
 * Adjust size anywhere it's used with the `size` prop (sets height in px;
 * width scales automatically so it never stretches).
 *
 *   <Logo size={40} />              full lockup, 40px tall
 *   <Logo size={32} variant="icon" />   icon-only, 32px tall
 */
export default function Logo({ size = 40, variant = "full" }) {
  const src = variant === "icon" ? iconLogo : fullLogo;
  return (
    <img
      src={src}
      alt="HandiPlug"
      style={{ height: size, width: "auto", maxWidth: "100%", objectFit: "contain" }}
    />
  );
}
