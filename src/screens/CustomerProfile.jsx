import { useNavigate } from "react-router-dom";
import { StatusSpace, Avatar, TextInput, Button } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import SidebarDesktop from "../components/SidebarDesktop";
import { useAuth } from "../context/AuthContext";

const ROWS = [
  { label: "My Bookings", path: "/bookings" },
  { label: "Saved Artisans", path: "/saved-artisans" },
  { label: "Reviews I've Left", path: "/my-reviews" },
  { label: "Brand / Logo", path: "/brand" },
  { label: "Settings", path: "/settings" },
];

export default function CustomerProfile() {
  const navigate = useNavigate();
  const { user, isAuthed, logout } = useAuth();

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="px-6 pt-4">
            <h1 className="text-[#1F2937] text-2xl font-bold">Profile</h1>
          </div>
          <div className="flex flex-col items-center gap-2 pt-6 pb-2">
            <Avatar size={80} />
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
              <Avatar size={80} />
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
