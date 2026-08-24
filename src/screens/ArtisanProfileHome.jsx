import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Avatar, VerifiedBadge, Stars, Button } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import SidebarDesktop from "../components/SidebarDesktop";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { supabase } from "../lib/supabaseClient";

const ROWS = [
  { label: "Portfolio", path: "/artisan/portfolio" },
  { label: "Payout Details", path: "/artisan/payout" },
  { label: "Verification Status", path: "/artisan/kyc" },
  { label: "Settings", path: "/settings" },
];

export default function ArtisanProfileHome() {
  const navigate = useNavigate();
  const { user, token, isAuthed, logout } = useAuth();
  
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAvatarChange = async (e) => {
    if (!e.target.files?.length || !isAuthed) return;
    const file = e.target.files[0];
    e.target.value = ""; // allow picking the same file again later

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return alert("Only JPEG, PNG, and WebP are allowed.");
    }
    if (file.size > 5 * 1024 * 1024) {
      return alert("Image is too large. Please choose a file under 5MB.");
    }

    setUploading(true);
    try {
      // Upload directly to Supabase Storage via a signed URL — the file
      // never passes through our server, so no size-limit issues.
      const { path, signedUrl, token: uploadToken } = await api.getAvatarUploadUrl(
        { fileName: file.name, fileType: file.type },
        token
      );

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .uploadToSignedUrl(path, uploadToken, file, { contentType: file.type });

      if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload image");
      }

      await api.confirmAvatarUpload({ path }, token);
      window.location.reload();
    } catch (err) {
      alert(err.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white flex flex-col h-full w-full">
      <input 
        type="file" 
        accept="image/jpeg,image/png,image/webp" 
        ref={fileInputRef} 
        onChange={handleAvatarChange} 
        className="hidden" 
      />

      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="px-6 pt-4">
            <h1 className="text-[#1F2937] text-2xl font-bold">Profile</h1>
          </div>
          <div className="flex flex-col items-center gap-2 pt-6 pb-2">
            
            <div className="relative cursor-pointer" onClick={() => isAuthed && fileInputRef.current?.click()}>
              <Avatar size={80} src={user?.avatarUrl} />
              {isAuthed && (
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                  <div className="bg-[#1C4CD1] rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
                    {uploading ? "..." : "📷"}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <p className="text-[#1F2937] text-lg font-semibold">{user?.fullName || "Guest"}</p>
              {user?.verified && <VerifiedBadge />}
            </div>
            <p className="text-[#6B7280] text-sm">{user?.trade ? `${user.trade} · ${user.area || "Lagos"}` : "Not logged in"}</p>
            {user?.rating > 0 && <Stars rating={user.rating} />}
            {!isAuthed && (
              <button onClick={() => navigate("/login")} className="text-[#FF7A00] text-sm font-semibold mt-1">Log In</button>
            )}
          </div>
          <div className="px-6 pt-4">
            {ROWS.map((row) => (
              <button key={row.label} onClick={() => navigate(row.path)} className="w-full flex items-center justify-between py-4 border-b border-[#E5E7EB] text-left">
                <span className="text-[#1F2937] text-base">{row.label}</span>
                <span className="text-[#9CA3AF] text-lg">›</span>
              </button>
            ))}
            {isAuthed && (
              <button onClick={doLogout} className="w-full text-left py-4 text-[#EF4444] text-base font-medium">Logout</button>
            )}
          </div>
        </div>
        <BottomNav role="artisan" />
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="artisan" />
        <div className="flex-1 flex overflow-hidden">
          <SidebarDesktop
            title="ARTISAN"
            links={[
              ...ROWS.map((r) => ({ label: r.label, path: r.path })),
              ...(isAuthed ? [{ label: "Logout", onClick: doLogout }] : []),
            ]}
          />
          <div className="flex-1 overflow-y-auto px-12 py-10">
            {isAuthed ? (
              <div className="max-w-[560px] mx-auto flex flex-col items-center gap-3 border border-[#E5E7EB] rounded-2xl p-8">
                
                <div className="relative cursor-pointer" onClick={() => isAuthed && fileInputRef.current?.click()}>
                  <Avatar size={88} src={user?.avatarUrl} />
                  {isAuthed && (
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                      <div className="bg-[#1C4CD1] rounded-full w-8 h-8 flex items-center justify-center text-white text-sm">
                        {uploading ? "..." : "📷"}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-[#1F2937] text-xl font-bold">{user.fullName}</p>
                  {user.verified && <VerifiedBadge />}
                </div>
                <p className="text-[#6B7280] text-sm">{user.trade} · {user.area || "Lagos"}</p>
                {user.rating > 0 && <Stars rating={user.rating} />}
                {!user.verified && (
                  <button onClick={() => navigate("/artisan/kyc")} className="text-[#FF7A00] text-sm font-semibold mt-2">
                    Complete verification →
                  </button>
                )}
              </div>
            ) : (
              <div className="max-w-[360px] border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-3">
                <p className="text-[#6B7280] text-sm">Log in to see and manage your artisan profile.</p>
                <Button onClick={() => navigate("/login")}>Log In</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}