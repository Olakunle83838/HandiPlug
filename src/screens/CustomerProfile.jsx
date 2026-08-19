import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Avatar, Button, TextInput } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import SidebarDesktop from "../components/SidebarDesktop";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const ROWS = [
  { label: "My Bookings", path: "/bookings" },
  { label: "Saved Artisans", path: "/saved-artisans" },
  { label: "My Reviews", path: "/my-reviews" },
  { label: "Settings", path: "/settings" },
];

export default function CustomerProfile() {
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
    
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return alert("Only JPEG, PNG, and WebP are allowed.");
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.uploadAvatar(formData, token);
      
      // We force a page reload to resync AuthContext via /me to update the avatarUrl everywhere, 
      // or we can just rely on the user object updating next time they refresh. 
      // Since AuthContext doesn't expose a setUser method, reloading is safest for now to sync global state.
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
            <p className="text-[#1F2937] text-lg font-semibold mt-2">{user?.fullName || "Guest"}</p>
            <p className="text-[#6B7280] text-sm">{isAuthed ? user?.email : "Not logged in"}</p>
            {!isAuthed && (
              <button onClick={() => navigate("/login")} className="text-[#FF7A00] text-sm font-semibold mt-1">
                Log In
              </button>
            )}
          </div>
          <div className="px-6 pt-4">
            {ROWS.map((row) => (
              <button
                key={row.label}
                onClick={() => navigate(row.path)}
                className="w-full flex items-center justify-between py-4 border-b border-[#E5E7EB] text-left"
              >
                <span className="text-[#1F2937] text-base">{row.label}</span>
                <span className="text-[#9CA3AF] text-lg">›</span>
              </button>
            ))}
            {isAuthed && (
              <button onClick={doLogout} className="w-full text-left py-4 text-[#EF4444] text-base font-medium">
                Logout
              </button>
            )}
          </div>
        </div>
        <BottomNav />
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" />
        <div className="flex-1 flex overflow-hidden">
          <SidebarDesktop
            title="SETTINGS"
            links={[
              ...ROWS.map((r) => ({ label: r.label, path: r.path })),
              ...(isAuthed ? [{ label: "Logout", onClick: doLogout }] : []),
            ]}
          />
          <div className="flex-1 overflow-y-auto px-12 py-8">
            <div className="max-w-[720px] flex flex-col gap-6">
              <h1 className="text-[#1F2937] text-2xl font-bold">Profile Information</h1>
              
              <div className="relative inline-block self-start cursor-pointer" onClick={() => isAuthed && fileInputRef.current?.click()}>
                <Avatar size={80} src={user?.avatarUrl} />
                {isAuthed && (
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                    <div className="bg-[#1C4CD1] rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
                      {uploading ? "..." : "📷"}
                    </div>
                  </div>
                )}
              </div>

              {isAuthed ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput label="Full Name" defaultValue={user.fullName} readOnly />
                    <TextInput label="Email" defaultValue={user.email} readOnly />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput label="Phone" defaultValue={user.phone || "—"} readOnly />
                    <TextInput label="Location" defaultValue={user.address || "—"} readOnly />
                  </div>
                  <p className="text-[#9CA3AF] text-xs">
                    Editable profile fields go in Settings — this view shows what's on file.
                  </p>
                </>
              ) : (
                <div className="border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-3 max-w-[360px]">
                  <p className="text-[#6B7280] text-sm">Log in to see and manage your profile.</p>
                  <Button onClick={() => navigate("/login")}>Log In</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
