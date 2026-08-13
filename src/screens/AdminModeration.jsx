import { useState } from "react";
import { StatusSpace, Card, Avatar } from "../components/UI";
import TopNav from "../components/TopNav";
import SidebarDesktop from "../components/SidebarDesktop";
import { Table, THead, TRow, TCell } from "../components/DesktopExtras";
import { adminStats, verificationQueue } from "../data/mockData";

export default function AdminModeration() {
  const [tab, setTab] = useState("Verification Queue");
  const [queue, setQueue] = useState(verificationQueue);
  const [desktopQueue, setDesktopQueue] = useState([
    { id: 1, name: "Ifeanyi Obi", trade: "Electrician", submitted: "2 days ago", docs: "ID · Certification" },
    { id: 2, name: "Musa Sani", trade: "Plumber", submitted: "1 day ago", docs: "ID · Portfolio" },
    { id: 3, name: "Blessing Eze", trade: "Electrician", submitted: "4 hours ago", docs: "ID · Certification" },
  ]);

  const resolve = (id) => setQueue((q) => q.filter((item) => item.id !== id));
  const resolveDesktop = (id) => setDesktopQueue((q) => q.filter((item) => item.id !== id));

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 overflow-y-auto px-6 pt-2 flex flex-col gap-5 pb-6">
          <h1 className="text-[#1F2937] text-2xl font-bold">Admin — Moderation</h1>
          <div className="flex gap-3">
            {adminStats.map((s) => (
              <Card key={s.label} className="flex-1 flex flex-col gap-1">
                <p className="text-[#6B7280] text-xs font-medium">{s.label}</p>
                <p className="text-[#1F2937] text-2xl font-bold">{s.value}</p>
              </Card>
            ))}
          </div>
          <div className="flex gap-2">
            {["Verification Queue", "Flagged Content"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 h-8 rounded-full text-sm font-medium whitespace-nowrap ${
                  tab === t ? "bg-[#0F2A44] text-white" : "bg-[#F5F6F8] text-[#6B7280]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "Verification Queue" ? (
            <div className="flex flex-col gap-3">
              {queue.length === 0 && <p className="text-[#6B7280] text-sm text-center pt-8">Queue is clear ✅</p>}
              {queue.map((item) => (
                <Card key={item.id} className="flex gap-3">
                  <Avatar size={48} />
                  <div className="flex-1 flex flex-col gap-2">
                    <div>
                      <p className="text-[#1F2937] text-sm font-semibold">{item.name}</p>
                      <p className="text-[#6B7280] text-xs">{item.trade} · {item.submitted}</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="text-[#0F2A44] text-xs font-semibold underline">View ID</button>
                      <button className="text-[#0F2A44] text-xs font-semibold underline">View selfie match</button>
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button onClick={() => resolve(item.id)} className="flex-1 h-9 rounded-[8px] bg-[#22C55E] text-white text-xs font-semibold">✓ Approve</button>
                      <button onClick={() => resolve(item.id)} className="flex-1 h-9 rounded-[8px] border border-[#E5E7EB] text-[#1F2937] text-xs font-semibold">✕ Reject</button>
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
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="admin" />
        <div className="flex-1 flex overflow-hidden">
          <SidebarDesktop
            title="ADMIN"
            links={[
              { label: "Verifications", onClick: () => setTab("Verification Queue") },
              { label: "Flagged Reviews", onClick: () => setTab("Flagged Content") },
              { label: "Users" },
              { label: "Reports" },
            ]}
          />
          <div className="flex-1 overflow-y-auto px-10 py-8">
            <div className="max-w-[1150px] flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h1 className="text-[#1F2937] text-2xl font-bold">Pending Artisan Verifications</h1>
                <span className="text-[#6B7280] text-sm">{desktopQueue.length} awaiting review</span>
              </div>
              <Table>
                <THead
                  columns={[
                    { label: "Artisan", className: "w-[260px]" },
                    { label: "Trade", className: "w-[170px]" },
                    { label: "Submitted", className: "w-[180px]" },
                    { label: "Documents", className: "w-[220px]" },
                    { label: "", className: "flex-1" },
                  ]}
                />
                {desktopQueue.length === 0 && (
                  <div className="text-[#6B7280] text-sm text-center py-8">Queue is clear ✅</div>
                )}
                {desktopQueue.map((item) => (
                  <TRow key={item.id}>
                    <TCell className="w-[260px] flex items-center gap-3">
                      <Avatar size={32} />
                      <span className="text-[#1F2937] text-sm font-medium">{item.name}</span>
                    </TCell>
                    <TCell className="w-[170px] text-[#1F2937] text-sm">{item.trade}</TCell>
                    <TCell className="w-[180px] text-[#1F2937] text-sm">{item.submitted}</TCell>
                    <TCell className="w-[220px] text-[#1F2937] text-sm">{item.docs}</TCell>
                    <TCell className="flex-1 flex gap-3 justify-end">
                      <button onClick={() => resolveDesktop(item.id)} className="h-9 px-4 rounded-[8px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold">Reject</button>
                      <button onClick={() => resolveDesktop(item.id)} className="h-9 px-4 rounded-[8px] bg-[#22C55E] text-white text-sm font-semibold">Approve</button>
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
