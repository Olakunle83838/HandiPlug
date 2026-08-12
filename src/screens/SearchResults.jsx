import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Card, Avatar, VerifiedBadge, Stars, Chip, Label } from "../components/UI";
import BottomNav from "../components/BottomNav";
import { searchResults } from "../data/mockData";

const FILTERS = ["Verified", "Rating 4+", "Price", "Nearby"];

export default function SearchResults() {
  const navigate = useNavigate();
  const [active, setActive] = useState([]);

  const toggle = (f) =>
    setActive((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  return (
    <div className="bg-white flex flex-col h-full w-full">
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
              <Chip key={f} active={active.includes(f)} onClick={() => toggle(f)}>
                {f}
              </Chip>
            ))}
          </div>
        </div>

        <Label>3 Electricians near Lekki</Label>

        <div className="flex flex-col gap-3 pb-4">
          {searchResults.map((a) => (
            <Card
              key={a.id}
              className="flex items-center gap-3.5 cursor-pointer"
              onClick={() => navigate("/artisan-profile")}
            >
              <Avatar size={56} />
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <p className="text-[#1F2937] text-sm font-semibold">{a.name}</p>
                  {a.verified && <VerifiedBadge />}
                </div>
                <p className="text-[#6B7280] text-sm">
                  {a.trade} · {a.area}
                </p>
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
  );
}
