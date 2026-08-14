import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, TextInput, Button, Label } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import SidebarDesktop from "../components/SidebarDesktop";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const navigate = useNavigate();
  const { token, user, isAuthed, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setMessage("");
    if (!isAuthed) {
      navigate("/login");
      return;
    }
    if (!currentPassword || !newPassword) {
      setError("Fill in both fields.");
      return;
    }
    setLoading(true);
    try {
      await api.changePassword({ currentPassword, newPassword }, token);
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Form = () => (
    <div className="flex flex-col gap-4">
      <Label>Account</Label>
      <div className="border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-1">
        <p className="text-[#1F2937] text-sm font-medium">{user?.fullName || "Not logged in"}</p>
        <p className="text-[#6B7280] text-sm">{user?.email}</p>
      </div>

      <Label>Change Password</Label>
      <TextInput label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
      <TextInput label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      {message && <p className="text-[#22C55E] text-sm">{message}</p>}
      {error && <p className="text-[#EF4444] text-sm">{error}</p>}
      <Button onClick={submit} disabled={loading}>{loading ? "Saving..." : "Update Password"}</Button>

      <button
        onClick={() => { logout(); navigate("/login"); }}
        className="text-[#EF4444] text-sm font-semibold self-start mt-2"
      >
        Log Out
      </button>
    </div>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center gap-3 px-6 pt-2">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
          <h1 className="text-[#1F2937] text-2xl font-bold">Settings</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
          <Form />
        </div>
        <BottomNav role={user?.role === "artisan" ? "artisan" : "customer"} />
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant={user?.role === "artisan" ? "artisan" : "app"} />
        <div className="flex-1 flex overflow-hidden">
          <SidebarDesktop
            title="SETTINGS"
            links={[
              { label: "Security" },
              { label: "Brand / Logo", path: "/brand" },
              { label: "Log Out", onClick: () => { logout(); navigate("/login"); } },
            ]}
          />
          <div className="flex-1 overflow-y-auto px-12 py-8">
            <div className="max-w-[480px]">
              <h1 className="text-[#1F2937] text-2xl font-bold mb-6">Settings</h1>
              <Form />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
