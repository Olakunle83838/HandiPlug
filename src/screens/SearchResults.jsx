import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Card, Avatar, VerifiedBadge, Stars, Chip, Label } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import SidebarDesktop from "../components/SidebarDesktop";
import { useArtisans, mockSearch } from "../lib/useArtisans";

const FILTERS = ["Verified", "Rating 4+", "Price", "Nearby"];

export default function SearchResults() {
  const navigate = useNavigate();
  const [active, setActive] = useState([]);
  const [search, setSearch] = useState("Electrician · Lekki");
  const { artisans: searchResults, loading } = useArtisans({}, mockSearch);

  const toggle = (f) =>
    setActive((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col overflow-y-auto px-6 pt-4 gap-4">
          <h1 className="text-[#1F2937] text-2xl font-bold">Find an artisan</h1>
          <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-[10px] h-[52px] px-4">
            <span>🔍</span>
            <span className="text-[16px] text-[#1F2937]">Electrician · Lekki</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <Label>Filter</Label>
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {FILTERS.map((f) => (
                <Chip key={f} active={active.includes(f)} onClick={() => toggle(f)}>{f}</Chip>
              ))}
            </div>
          </div>
          <Label>3 Electricians near Lekki</Label>
          <div className="flex flex-col gap-3 pb-4">
            {searchResults.map((a) => (
              <Card key={a.id} className="flex items-center gap-3.5 cursor-pointer" onClick={() => navigate(`/artisan-profile?id=${a.id}`)}>
                <Avatar size={56} />
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[#1F2937] text-sm font-semibold">{a.name}</p>
                    {a.verified && <VerifiedBadge />}
                  </div>
                  <p className="text-[#6B7280] text-sm">{a.trade} · {a.area}</p>
                  <div className="flex items-center justify-between">
                    <Stars rating={a.rating} />
                    <span className="text-[#6B7280] text-sm">{a.price}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" search={search} onSearchChange={setSearch} searchPlaceholder="Electrician · Lekki" />
        <div className="flex-1 flex overflow-hidden">
          <SidebarDesktop
            sections={[
              {
                title: "Trade",
                content: (
                  <>
                    {["Electrician", "Plumber", "Carpenter"].map((t) => (
                      <button key={t} className="w-full text-left h-[41px] px-3.5 rounded-[10px] text-sm font-medium text-[#1F2937] hover:bg-[#F5F6F8]">
                        {t}
                      </button>
                    ))}
                  </>
                ),
              },
              {
                title: "Rating",
                content: (
                  <div className="flex gap-2 px-3.5">
                    <Chip>4+ ★</Chip>
                    <Chip>3+ ★</Chip>
                  </div>
                ),
              },
              {
                title: "Verification",
                content: (
                  <div className="px-3.5">
                    <Chip>✓ Verified only</Chip>
                  </div>
                ),
              },
            ]}
          />
          <div className="flex-1 overflow-y-auto px-10 py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[#1F2937] text-2xl font-bold">Electricians in Lekki</h1>
              <span className="text-[#6B7280] text-sm">12 results</span>
            </div>
            <div className="flex flex-col gap-3">
              {searchResults.map((a) => (
                <div key={a.id} className="flex items-center justify-between border border-[#E5E7EB] rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-4">
                    <Avatar size={52} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[#1F2937] font-semibold">{a.name}</p>
                        {a.verified && <VerifiedBadge />}
                      </div>
                      <p className="text-[#6B7280] text-sm mt-1">
                        {a.trade} · {a.area} · <Stars rating={a.rating} />
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[#1F2937] font-semibold">{a.price}</span>
                    <button
                      onClick={() => navigate(`/artisan-profile?id=${a.id}`)}
                      className="h-[34px] px-4 rounded-[8px] border border-[#E5E7EB] text-[#1F2937] text-sm font-semibold hover:bg-[#F5F6F8]"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
