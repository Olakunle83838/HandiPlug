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
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);

  useEffect(() => {
    // RoleRoute already ensures we are admin, but just a safety fallback
    if (!isAuthed || user?.role !== "admin") return;
    
    api.adminUsers(token)
      .then((res) => setUsers(res.users))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [isAuthed, token, user]);

  const toggleSuspend = async (targetUser) => {
    // Prevent self-suspension
    if (targetUser.id === user.id) {
      return alert("You cannot suspend yourself.");
    }
    
    // Confirm action
    const action = targetUser.isSuspended ? "restore" : "suspend";
    if (!window.confirm(`Are you sure you want to ${action} ${targetUser.fullName}?`)) {
      return;
    }

    setActionInProgress(targetUser.id);
    try {
      await api.adminSuspendUser(targetUser.id, !targetUser.isSuspended, token);
      // Update local state
      setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, isSuspended: !targetUser.isSuspended } : u));
    } catch (err) {
      alert(err.message || `Failed to ${action} user`);
    } finally {
      setActionInProgress(null);
    }
  };

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
          {loading ? (
             <div className="flex justify-center p-6">
               <div className="w-8 h-8 border-4 border-[#1C4CD1] border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : list.map((u) => (
            <div key={u.id} className="border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-2 relative">
              <div className="flex items-center justify-between">
                <p className="text-[#1F2937] text-sm font-semibold">{u.fullName}</p>
                {roleBadge(u.role)}
              </div>
              <p className="text-[#6B7280] text-sm">{u.email}</p>
              
              <div className="flex items-center gap-2 mt-1">
                {u.role === "artisan" && u.verified && <VerifiedBadge />}
                {u.isSuspended && (
                  <span className="inline-flex items-center rounded-full bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5">
                    Suspended
                  </span>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex justify-end">
                <button 
                  disabled={actionInProgress === u.id || u.id === user.id}
                  onClick={() => toggleSuspend(u)}
                  className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors ${
                    u.isSuspended 
                      ? "bg-[#1F2937] text-white hover:bg-black" 
                      : "bg-[#EF4444] text-white hover:bg-red-700"
                  } disabled:opacity-50`}
                >
                  {actionInProgress === u.id ? "Processing..." : u.isSuspended ? "Restore User" : "Suspend User"}
                </button>
              </div>
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
            <button onClick={() => navigate("/admin")} className="text-left h-10 px-3 rounded-[8px] text-sm font-medium text-[#1F2937] hover:bg-[#F5F6F8]">📄 Verification queue</button>
            <button className="text-left h-10 px-3 rounded-[8px] text-sm font-medium bg-[#EEF2FF] text-[#1C4CD1]">👥 Users</button>
          </nav>
          <button onClick={() => { logout(); navigate("/login"); }} className="text-left h-10 px-3 rounded-[8px] text-sm font-medium text-[#1F2937] hover:bg-[#F5F6F8]">
            ↩️ Log out
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-10 py-8">
          <div className="max-w-[1000px] flex flex-col gap-6">
            <h1 className="text-[#1F2937] text-2xl font-bold">All Users ({list.length})</h1>
            
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-8 h-8 border-4 border-[#1C4CD1] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <Table>
                <THead
                  columns={[
                    { label: "Name", className: "w-[200px]" },
                    { label: "Email", className: "w-[240px]" },
                    { label: "Role", className: "w-[120px]" },
                    { label: "Status", className: "w-[180px]" },
                    { label: "Actions", className: "flex-1" },
                  ]}
                />
                {list.map((u) => (
                  <TRow key={u.id}>
                    <TCell className="w-[200px] text-[#1F2937] text-sm font-medium">{u.fullName}</TCell>
                    <TCell className="w-[240px] text-[#6B7280] text-sm">{u.email}</TCell>
                    <TCell className="w-[120px]">{roleBadge(u.role)}</TCell>
                    <TCell className="w-[180px] flex items-center gap-2">
                      {u.isSuspended ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5">
                          Suspended
                        </span>
                      ) : (
                        <span className="text-[#22C55E] text-xs font-semibold">Active</span>
                      )}
                      {u.role === "artisan" && u.verified && <VerifiedBadge />}
                    </TCell>
                    <TCell className="flex-1">
                      <button 
                        disabled={actionInProgress === u.id || u.id === user.id}
                        onClick={() => toggleSuspend(u)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                          u.isSuspended 
                            ? "bg-[#1F2937] text-white hover:bg-black" 
                            : "bg-[#EF4444] text-white hover:bg-red-700"
                        } disabled:opacity-50`}
                      >
                        {actionInProgress === u.id ? "..." : u.isSuspended ? "Restore" : "Suspend"}
                      </button>
                    </TCell>
                  </TRow>
                ))}
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
