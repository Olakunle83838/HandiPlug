import { useEffect, useState } from "react";
import { StatusSpace, Card, Avatar } from "../components/UI";
import TopNav from "../components/TopNav";
import SidebarDesktop from "../components/SidebarDesktop";
import { Table, THead, TRow, TCell } from "../components/DesktopExtras";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { adminStats as mockStats } from "../data/mockData";

export default function AdminModeration() {
  const { token, isAuthed, user } = useAuth();
  const [tab, setTab] = useState("Verification Queue");
  const [queue, setQueue] = useState(null);
  const [stats, setStats] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = () => {
    if (!isAuthed || user?.role !== "admin") return;
    api.adminQueue(token).then((res) => setQueue(res.queue)).catch(() => setQueue([]));
    api.adminStats(token).then((res) => setStats(res.stats)).catch(() => setStats(null));
  };
  useEffect(load, [isAuthed, token]);

  const live = queue !== null;
  const list = live ? queue : [];
  const statsToShow = stats
    ? [
        { label: "Users", value: stats.users },
        { label: "Pending KYC", value: stats.pendingKyc },
        { label: "Flags", value: stats.flags },
      ]
    : mockStats;

  const decide = async (id, decision) => {
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
          <h1 className="text-[#1F2937] text-2xl font-bold">Admin — Moderation</h1>
          <div className="flex gap-3">
            {statsToShow.map((s) => (
              <Card key={s.label} className="flex-1 flex flex-col gap-1">
                <p className="text-[#6B7280] text-xs font-medium">{s.label}</p>
                <p className="text-[#1F2937] text-2xl font-bold">{s.value}</p>
              </Card>
            ))}
          </div>
          <div className="flex gap-2">
            {["Verification Queue", "Flagged Content"].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 h-8 rounded-full text-sm font-medium whitespace-nowrap ${tab === t ? "bg-[#0F2A44] text-white" : "bg-[#F5F6F8] text-[#6B7280]"}`}>{t}</button>
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
                      <p className="text-[#6B7280] text-xs">{item.trade} · {item.documentType}</p>
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button disabled={busy === item.id} onClick={() => decide(item.id, "approve")} className="flex-1 h-9 rounded-[8px] bg-[#22C55E] text-white text-xs font-semibold disabled:opacity-50">✓ Approve</button>
                      <button disabled={busy === item.id} onClick={() => decide(item.id, "reject")} className="flex-1 h-9 rounded-[8px] border border-[#E5E7EB] text-[#1F2937] text-xs font-semibold disabled:opacity-50">✕ Reject</button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-[#6B7280] text-sm text-center pt-8">No flagging system implemented yet.</p>
          )}
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="admin" />
        <div className="flex-1 flex overflow-hidden">
          <SidebarDesktop
            title="ADMIN"
            links={[
              { label: "Verifications", onClick: () => setTab("Verification Queue") },
              { label: "Flagged Reviews", onClick: () => setTab("Flagged Content") },
              { label: "Users", path: "/admin/users" },
              { label: "Product Branding", path: "/brand" },
            ]}
          />
          <div className="flex-1 overflow-y-auto px-10 py-8">
            <div className="max-w-[1150px] flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h1 className="text-[#1F2937] text-2xl font-bold">Pending Artisan Verifications</h1>
                <span className="text-[#6B7280] text-sm">{list.length} awaiting review</span>
              </div>
              <Table>
                <THead
                  columns={[
                    { label: "Artisan", className: "w-[260px]" },
                    { label: "Trade", className: "w-[170px]" },
                    { label: "Document", className: "w-[220px]" },
                    { label: "Submitted", className: "w-[180px]" },
                    { label: "", className: "flex-1" },
                  ]}
                />
                {list.length === 0 && <div className="text-[#6B7280] text-sm text-center py-8">Queue is clear ✅</div>}
                {list.map((item) => (
                  <TRow key={item.id}>
                    <TCell className="w-[260px] flex items-center gap-3">
                      <Avatar size={32} />
                      <span className="text-[#1F2937] text-sm font-medium">{item.artisanName}</span>
                    </TCell>
                    <TCell className="w-[170px] text-[#1F2937] text-sm">{item.trade}</TCell>
                    <TCell className="w-[220px] text-[#1F2937] text-sm">{item.documentType}</TCell>
                    <TCell className="w-[180px] text-[#1F2937] text-sm">{new Date(item.submittedAt).toLocaleDateString()}</TCell>
                    <TCell className="flex-1 flex gap-3 justify-end">
                      <button disabled={busy === item.id} onClick={() => decide(item.id, "reject")} className="h-9 px-4 rounded-[8px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold disabled:opacity-50">Reject</button>
                      <button disabled={busy === item.id} onClick={() => decide(item.id, "approve")} className="h-9 px-4 rounded-[8px] bg-[#22C55E] text-white text-sm font-semibold disabled:opacity-50">Approve</button>
                    </TCell>
                  </TRow>
                ))}
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
