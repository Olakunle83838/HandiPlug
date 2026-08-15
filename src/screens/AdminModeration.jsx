import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Card, Avatar } from "../components/UI";
import { Table, THead, TRow, TCell } from "../components/DesktopExtras";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { adminStats as mockStats, verificationQueue as mockQueue } from "../data/mockData";

export default function AdminModeration() {
  const navigate = useNavigate();
  const { token, isAuthed, user, logout } = useAuth();
  const [tab, setTab] = useState("Verification Queue");
  const [queue, setQueue] = useState(null);
  const [stats, setStats] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = () => {
    if (!isAuthed || user?.role !== "admin") return;
    api.adminQueue(token).then((res) => setQueue(res.queue)).catch(() => setQueue(null));
    api.adminStats(token).then((res) => setStats(res.stats)).catch(() => setStats(null));
  };
  useEffect(load, [isAuthed, token]);

  const live = queue !== null;
  const list = live ? queue : mockQueue.map((q) => ({ ...q, artisanName: q.name, documentType: "ID + Selfie", submittedAt: null }));
  const statsToShow = stats
    ? [
        { icon: "👥", label: "Total users", value: stats.users },
        { icon: "📄", label: "Pending KYC", value: stats.pendingKyc },
        { icon: "⚠️", label: "Open flags", value: stats.flags },
      ]
    : mockStats.map((s, i) => ({ icon: ["👥", "📄", "⚠️"][i], ...s }));

  const decide = async (id, decision) => {
    if (!live) return; // demo mode, nothing to call
    setBusy(id);
    try {
      await api.adminDecide(id, decision, token);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  if (isAuthed && user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-full w-full p-10 text-center">
        <p className="text-[#6B7280]">
          This page is for admin accounts only. Log in with the demo admin account
          (admin@handiplug.ng / admin1234) to view it.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 overflow-y-auto px-6 pt-2 flex flex-col gap-5 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[#1F2937] text-2xl font-bold">Admin — Moderation</h1>
            <span className="bg-[#EEF2FF] text-[#1C4CD1] text-xs font-semibold rounded-full px-3 py-1.5">Group 9 Admin</span>
          </div>
          <div className="flex gap-3">
            {statsToShow.map((s) => (
              <Card key={s.label} className="flex-1 flex flex-col gap-1">
                <span className="text-lg">{s.icon}</span>
                <p className="text-[#1F2937] text-xl font-bold">{s.value}</p>
                <p className="text-[#6B7280] text-xs font-medium">{s.label}</p>
              </Card>
            ))}
          </div>
          <div className="flex gap-2">
            {["Verification Queue", "Flagged Content"].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 h-8 rounded-full text-sm font-medium whitespace-nowrap ${tab === t ? "bg-[#1C4CD1] text-white" : "bg-[#F5F6F8] text-[#6B7280]"}`}>{t}</button>
            ))}
          </div>
          {tab === "Verification Queue" ? (
            <div className="flex flex-col gap-3">
              {list.length === 0 && <p className="text-[#6B7280] text-sm text-center pt-8">Queue is clear ✅</p>}
              {list.map((item) => (
                <Card key={item.id} className="flex gap-3">
                  <Avatar size={48} />
                  <div className="flex-1 flex flex-col gap-2">
                    <div>
                      <p className="text-[#1F2937] text-sm font-semibold">{item.artisanName}</p>
                      <p className="text-[#6B7280] text-xs">{item.trade} · submitted {item.submitted || "recently"}</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-[#1C4CD1] text-xs font-semibold">👁️ View ID</span>
                      <span className="text-[#1C4CD1] text-xs font-semibold">👁️ View selfie match</span>
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button disabled={busy === item.id} onClick={() => decide(item.id, "approve")} className="flex-1 h-9 rounded-[8px] bg-[#DCFCE7] text-[#15803D] text-xs font-semibold disabled:opacity-50">✓ Approve</button>
                      <button disabled={busy === item.id} onClick={() => decide(item.id, "reject")} className="flex-1 h-9 rounded-[8px] bg-[#FEE2E2] text-[#DC2626] text-xs font-semibold disabled:opacity-50">✕ Reject</button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-[#6B7280] text-sm text-center pt-8">No flagged content 🎉</p>
          )}
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
            <button
              onClick={() => setTab("Verification Queue")}
              className={`text-left h-10 px-3 rounded-[8px] text-sm font-medium ${tab === "Verification Queue" ? "bg-[#EEF2FF] text-[#1C4CD1]" : "text-[#1F2937] hover:bg-[#F5F6F8]"}`}
            >
              📄 Verification queue
            </button>
            <button
              onClick={() => setTab("Flagged Content")}
              className={`text-left h-10 px-3 rounded-[8px] text-sm font-medium ${tab === "Flagged Content" ? "bg-[#EEF2FF] text-[#1C4CD1]" : "text-[#1F2937] hover:bg-[#F5F6F8]"}`}
            >
              ⚠️ Flagged content
            </button>
            <button onClick={() => navigate("/admin/users")} className="text-left h-10 px-3 rounded-[8px] text-sm font-medium text-[#1F2937] hover:bg-[#F5F6F8]">👥 Users</button>
            <button className="text-left h-10 px-3 rounded-[8px] text-sm font-medium text-[#1F2937] hover:bg-[#F5F6F8]">⚙️ Settings</button>
          </nav>
          <button onClick={() => { logout(); navigate("/login"); }} className="text-left h-10 px-3 rounded-[8px] text-sm font-medium text-[#1F2937] hover:bg-[#F5F6F8]">
            ↩️ Log out
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-10 py-6 border-b border-[#E5E7EB]">
            <h1 className="text-[#1F2937] text-2xl font-bold">Moderation</h1>
            <span className="bg-[#EEF2FF] text-[#1C4CD1] text-sm font-semibold rounded-full px-4 py-1.5">Group 9 Admin</span>
          </div>
          <div className="flex-1 overflow-y-auto px-10 py-6">
            <div className="max-w-[1150px] flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-4">
                {statsToShow.map((s) => (
                  <div key={s.label} className="border border-[#E5E7EB] rounded-2xl p-5">
                    <span className="text-lg">{s.icon}</span>
                    <p className="text-[#1F2937] text-2xl font-bold mt-1">{s.value}</p>
                    <p className="text-[#6B7280] text-sm">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {["Verification Queue", "Flagged Content"].map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`px-4 h-9 rounded-[8px] text-sm font-medium whitespace-nowrap ${tab === t ? "bg-[#1C4CD1] text-white" : "bg-[#F5F6F8] text-[#6B7280]"}`}>{t}</button>
                ))}
              </div>

              {tab === "Verification Queue" ? (
                <Table>
                  <THead
                    columns={[
                      { label: "Name", className: "w-[240px]" },
                      { label: "Trade", className: "w-[180px]" },
                      { label: "Submitted", className: "w-[160px]" },
                      { label: "Documents", className: "w-[200px]" },
                      { label: "Action", className: "flex-1" },
                    ]}
                  />
                  {list.length === 0 && <div className="text-[#6B7280] text-sm text-center py-8">Queue is clear ✅</div>}
                  {list.map((item) => (
                    <TRow key={item.id}>
                      <TCell className="w-[240px] text-[#1F2937] text-sm font-semibold">{item.artisanName}</TCell>
                      <TCell className="w-[180px] text-[#1F2937] text-sm">{item.trade}</TCell>
                      <TCell className="w-[160px] text-[#6B7280] text-sm">{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : item.submitted}</TCell>
                      <TCell className="w-[200px] flex gap-3">
                        <span className="text-[#1C4CD1] text-sm font-semibold">👁️ ID</span>
                        <span className="text-[#1C4CD1] text-sm font-semibold">👁️ Selfie</span>
                      </TCell>
                      <TCell className="flex-1 flex gap-3 justify-end">
                        <button disabled={busy === item.id} onClick={() => decide(item.id, "approve")} className="h-9 px-4 rounded-[8px] bg-[#DCFCE7] text-[#15803D] text-sm font-semibold disabled:opacity-50">✓ Approve</button>
                        <button disabled={busy === item.id} onClick={() => decide(item.id, "reject")} className="h-9 px-4 rounded-[8px] bg-[#FEE2E2] text-[#DC2626] text-sm font-semibold disabled:opacity-50">✕ Reject</button>
                      </TCell>
                    </TRow>
                  ))}
                </Table>
              ) : (
                <p className="text-[#6B7280] text-sm text-center py-8">No flagged content 🎉</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
