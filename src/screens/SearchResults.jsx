import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StatusSpace, Card, Avatar, VerifiedBadge, Stars, Chip, Label } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import { useArtisans, mockSearch } from "../lib/useArtisans";
import { trades } from "../data/mockData";

const TRADE_NAMES = trades.map((t) => t.label);

export default function SearchResults() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  // The actual filters driving the query — read straight from the URL so
  // clicking a category on Home (which navigates to /search?trade=X) and
  // typing in the search bar both actually change what's shown here.
  const tradeParam = params.get("trade") || "";
  const qParam = params.get("q") || "";
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState("");

  const [searchText, setSearchText] = useState(tradeParam || qParam || "");

  const filters = {
    ...(tradeParam ? { trade: tradeParam } : {}),
    ...(qParam ? { q: qParam } : {}),
    ...(verifiedOnly ? { verified: "true" } : {}),
    ...(minRating ? { minRating } : {}),
  };
  const { artisans: results, loading } = useArtisans(filters, mockSearch);

  const setTrade = (trade) => {
    setParams(trade ? { trade } : {});
  };

  const runTextSearch = (text) => {
    setSearchText(text);
  };
  const submitTextSearch = () => {
    if (searchText.trim()) setParams({ q: searchText.trim() });
    else setParams({});
  };

  const heading = tradeParam
    ? `${tradeParam}s near you`
    : qParam
    ? `Results for "${qParam}"`
    : "All artisans near you";

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col overflow-y-auto px-6 pt-4 gap-4">
          <h1 className="text-[#1F2937] text-2xl font-bold">Find an artisan</h1>
          <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-[10px] h-[52px] px-4">
            <span>🔍</span>
            <input
              value={searchText}
              onChange={(e) => runTextSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitTextSearch()}
              onBlur={submitTextSearch}
              placeholder="Search trade, e.g. Electrician"
              className="w-full outline-none text-[16px] text-[#1F2937] placeholder:text-[#9CA3AF] bg-transparent"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <Label>Filter</Label>
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              <Chip active={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>Verified</Chip>
              <Chip active={minRating === "4"} onClick={() => setMinRating((r) => (r === "4" ? "" : "4"))}>4★ & up</Chip>
              {TRADE_NAMES.map((t) => (
                <Chip key={t} active={tradeParam === t} onClick={() => setTrade(tradeParam === t ? "" : t)}>
                  {t}
                </Chip>
              ))}
            </div>
          </div>
          <Label>{loading ? "Searching…" : `${results.length} ${heading}`}</Label>
          <div className="flex flex-col gap-3 pb-4">
            {results.length === 0 && !loading && (
              <p className="text-[#6B7280] text-sm text-center pt-6">No artisans match those filters yet.</p>
            )}
            {results.map((a) => (
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
        <TopNav
          variant="app"
          search={searchText}
          onSearchChange={(v) => { setSearchText(v); }}
          searchPlaceholder="Search electricians, plumbers..."
        />
        <div className="flex-1 flex overflow-hidden">
          <div className="hidden md:flex flex-col w-[260px] shrink-0 border-r border-[#E5E7EB] py-7 px-5 gap-6 overflow-y-auto">
            <p className="text-[#1F2937] text-sm font-bold flex items-center gap-2">☰ Filters</p>

            <div className="flex flex-col gap-2">
              <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px]">TRADE</p>
              {TRADE_NAMES.map((t) => (
                <label key={t} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tradeParam === t}
                    onChange={() => setTrade(tradeParam === t ? "" : t)}
                    className="accent-[#1C4CD1] size-4"
                  />
                  <span className="text-[#1F2937] text-sm">{t}</span>
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px]">MIN. RATING</p>
              <div className="flex gap-2">
                {["3", "4", "4.5"].map((r) => (
                  <Chip key={r} active={minRating === r} onClick={() => setMinRating((cur) => (cur === r ? "" : r))}>
                    {r}★+
                  </Chip>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[#6B7280] text-xs font-bold tracking-[0.2px]">OTHER</p>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={() => setVerifiedOnly((v) => !v)}
                  className="accent-[#1C4CD1] size-4"
                />
                <span className="text-[#1F2937] text-sm">Verified only</span>
              </label>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-10 py-6">
            <div className="flex items-center gap-3 mb-4">
              <Chip active={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>Verified</Chip>
              <Chip active={minRating === "4"} onClick={() => setMinRating((r) => (r === "4" ? "" : "4"))}>4★ & up</Chip>
              <Chip>Price: Low to high</Chip>
              <Chip>Nearby</Chip>
            </div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[#1F2937] text-2xl font-bold">{heading}</h1>
              <span className="text-[#6B7280] text-sm">{loading ? "Searching…" : `${results.length} results`}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {results.length === 0 && !loading && (
                <p className="text-[#6B7280] text-sm col-span-2">No artisans match those filters yet.</p>
              )}
              {results.map((a) => (
                <div key={a.id} className="border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar size={48} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[#1F2937] font-semibold truncate">{a.name}</p>
                        {a.verified && <VerifiedBadge />}
                      </div>
                      <p className="text-[#6B7280] text-sm">{a.trade} · {a.area}</p>
                      <Stars rating={a.rating} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#1F2937] font-semibold">{a.price}</span>
                    <button
                      onClick={() => navigate(`/artisan-profile?id=${a.id}`)}
                      className="text-[#FA7E24] text-sm font-semibold"
                    >
                      View profile →
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
