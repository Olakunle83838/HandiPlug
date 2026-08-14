import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Button, Label } from "../components/UI";
import { useBrand } from "../context/BrandContext";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

// Admin-only: this controls the HandiPlug product logo shown to every
// visitor across the whole site — it is NOT a per-user profile setting.
export default function BrandSettings() {
  const navigate = useNavigate();
  const { user, isAuthed } = useAuth();
  const { logoSrc, logoHeight, uploadLogo, updateHeight, resetLogo } = useBrand();
  const fileRef = useRef(null);
  const [error, setError] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  if (!isAuthed || user?.role !== "admin") {
    return (
      <div className="bg-white flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-10 text-center">
          <p className="text-[#6B7280] text-sm">
            Product branding is managed by HandiPlug admins only. Log in with an admin
            account to change the site-wide logo.
          </p>
          <Button className="max-w-[220px]" onClick={() => navigate("/login")}>Log In</Button>
        </div>
      </div>
    );
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      await uploadLogo(file);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    }
    e.target.value = "";
  };

  return (
    <div className="bg-white flex flex-col h-full w-full">
      <StatusSpace />
      <div className="flex items-center gap-3 px-6 pt-2 md:px-12 md:pt-8">
        <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
        <h1 className="text-[#1F2937] text-2xl font-bold">Product Branding</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 md:px-12 pt-6 pb-10 flex flex-col gap-8 max-w-[560px]">
        <p className="text-[#6B7280] text-sm">
          This is the HandiPlug logo — it appears on the splash screen, nav bar,
          and login/signup pages for <strong>every visitor to the site</strong>,
          not just your account. Upload a PNG or JPG (max 5MB) to replace it.
        </p>

        <div className="border border-[#E5E7EB] rounded-2xl p-6 flex flex-col items-center gap-4">
          <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px] self-start">PREVIEW</p>
          <div className="bg-[#0F2A44] rounded-xl w-full h-[120px] flex items-center justify-center">
            <Logo size={logoHeight} />
          </div>
          {!logoSrc && (
            <p className="text-[#9CA3AF] text-xs">Using the default placeholder logo — upload yours below.</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <input ref={fileRef} type="file" accept="image/png,image/jpeg" onChange={handleFile} className="hidden" />
          <Button onClick={() => fileRef.current?.click()}>
            {logoSrc ? "Upload a different logo" : "Upload Site Logo"}
          </Button>
          {justSaved && <p className="text-[#22C55E] text-sm font-medium text-center">✓ Logo saved</p>}
          {error && <p className="text-[#EF4444] text-sm text-center">{error}</p>}
          {logoSrc && (
            <button onClick={resetLogo} className="text-[#6B7280] text-sm underline self-center">
              Reset to default logo
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label>Logo size ({logoHeight}px tall)</Label>
          <input
            type="range"
            min={24}
            max={200}
            value={logoHeight}
            onChange={(e) => updateHeight(Number(e.target.value))}
            className="w-full accent-[#FF7A00]"
          />
          <div className="flex justify-between text-xs text-[#9CA3AF]">
            <span>Small (24px)</span>
            <span>Large (200px)</span>
          </div>
        </div>

        <p className="text-[#9CA3AF] text-xs border-t border-[#E5E7EB] pt-4">
          Note: this is currently stored in your browser's local storage, so it applies
          on this device/browser only — not truly site-wide for every visitor yet. Moving
          it to the backend (one small table + endpoint) would make it a real global
          setting. Say the word if you want that upgrade.
        </p>
      </div>
    </div>
  );
}
