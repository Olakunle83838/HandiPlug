import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, VerifiedBadge } from "../components/UI";
import { Table, THead, TRow, TCell } from "../components/DesktopExtras";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function AdminUsers() {
  const navigate = useNavigate();
  const { token, isAuthed, user, logout } = useAuth();
  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (!isAuthed || user?.role !== "admin") return;
    api.adminUsers(token).then((res) => setUsers(res.users)).catch(() => setUsers([]));
  }, [isAuthed, token]);

  if (isAuthed && user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-full w-full p-10 text-center">
        <p className="text-[#6B7280]">This page is for admin accounts only.</p>
      </div>
    );
  }

  const list = users || [];

  const roleBadge = (role) => {
    const styles = {
      admin: "bg-[#1C4CD1]/10 text-[#1C4CD1]",
      artisan: "bg-[#FF7A00]/10 text-[#FF7A00]",
      customer: "bg-[#6B7280]/10 text-[#6B7280]",
    };
    return (
      <span className={`inline-flex items-center rounded-full text-xs font-semibold px-3 py-1 ${styles[role] || styles.customer}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="px-6 pt-2">
          <h1 className="text-[#1F2937] text-2xl font-bold">All Users</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-4 flex flex-col gap-3 pb-6">
          {list.map((u) => (
            <div key={u.id} className="border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <p className="text-[#1F2937] text-sm font-semibold">{u.fullName}</p>
                {roleBadge(u.role)}
              </div>
              <p className="text-[#6B7280] text-sm">{u.email}</p>
              {u.role === "artisan" && u.verified && <VerifiedBadge />}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:h-full md:w-full">
        <div className="w-[220px] shrink-0 border-r border-[#E5E7EB] flex flex-col py-6 px-3">
          <div className="flex items-center gap-2 px-3 pb-6">
            <span className="text-[#1C4CD1] text-lg">🛡️</span>
            <span className="font-extrabold text-[#1C4CD1]">HandiPlug</span>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            <button className="text-left h-10 px-3 rounded-[8px] text-sm font-medium text-[#1F2937] hover:bg-[#F5F6F8]">📊 Overview</button>
            <button onClick={() => navigate("/admin")} className="text-left h-10 px-3 rounded-[8px] text-sm font-medium text-[#1F2937] hover:bg-[#F5F6F8]">📄 Verification queue</button>
            <button className="text-left h-10 px-3 rounded-[8px] text-sm font-medium text-[#1F2937] hover:bg-[#F5F6F8]">⚠️ Flagged content</button>
            <button className="text-left h-10 px-3 rounded-[8px] text-sm font-medium bg-[#EEF2FF] text-[#1C4CD1]">👥 Users</button>
            <button className="text-left h-10 px-3 rounded-[8px] text-sm font-medium text-[#1F2937] hover:bg-[#F5F6F8]">⚙️ Settings</button>
          </nav>
          <button onClick={() => { logout(); navigate("/login"); }} className="text-left h-10 px-3 rounded-[8px] text-sm font-medium text-[#1F2937] hover:bg-[#F5F6F8]">
            ↩️ Log out
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-10 py-8">
          <div className="max-w-[1000px] flex flex-col gap-6">
            <h1 className="text-[#1F2937] text-2xl font-bold">All Users ({list.length})</h1>
            <Table>
              <THead
                columns={[
                  { label: "Name", className: "w-[240px]" },
                  { label: "Email", className: "w-[260px]" },
                  { label: "Role", className: "w-[140px]" },
                  { label: "Trade", className: "w-[160px]" },
                  { label: "Status", className: "flex-1" },
                ]}
              />
              {list.map((u) => (
                <TRow key={u.id}>
                  <TCell className="w-[240px] text-[#1F2937] text-sm font-medium">{u.fullName}</TCell>
                  <TCell className="w-[260px] text-[#6B7280] text-sm">{u.email}</TCell>
                  <TCell className="w-[140px]">{roleBadge(u.role)}</TCell>
                  <TCell className="w-[160px] text-[#1F2937] text-sm">{u.trade || "—"}</TCell>
                  <TCell className="flex-1">{u.role === "artisan" && (u.verified ? <VerifiedBadge /> : <span className="text-[#9CA3AF] text-xs">Unverified</span>)}</TCell>
                </TRow>
              ))}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
