import { useNavigate } from "react-router-dom";
import { StatusSpace, Avatar, VerifiedBadge, Stars } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import { useArtisans } from "../lib/useArtisans";

// Note: there's no "favorites" table in the backend yet — this screen
// shows a couple of the top-rated verified artisans as a stand-in for a
// real saved-artisans list. Wiring up actual save/unsave would need a
// small `favorites` table + POST/DELETE endpoints on the server.
export default function SavedArtisans() {
  const navigate = useNavigate();
  const { artisans } = useArtisans({ verified: "true" });
  const saved = artisans.slice(0, 2);

  const Row = ({ a }) => (
    <button
      onClick={() => navigate(`/artisan-profile?id=${a.id}`)}
      className="border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-3.5 text-left w-full"
    >
      <Avatar size={56} />
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className="text-[#1F2937] text-sm font-semibold">{a.name}</p>
          {a.verified && <VerifiedBadge />}
        </div>
        <p className="text-[#6B7280] text-sm">{a.trade} · {a.area}</p>
        <Stars rating={a.rating} />
      </div>
    </button>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center gap-3 px-6 pt-2">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
          <h1 className="text-[#1F2937] text-2xl font-bold">Saved Artisans</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-4 flex flex-col gap-3 pb-4">
          {saved.length === 0 && <p className="text-[#6B7280] text-sm text-center pt-8">No saved artisans yet.</p>}
          {saved.map((a) => <div key={a.id}>{Row({ a })}</div>)}
        </div>
        <BottomNav />
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" />
        <div className="flex-1 overflow-y-auto px-12 py-8">
          <div className="max-w-[800px] mx-auto flex flex-col gap-5">
            <h1 className="text-[#1F2937] text-2xl font-bold">Saved Artisans</h1>
            <div className="grid grid-cols-2 gap-4">
              {saved.map((a) => <div key={a.id}>{Row({ a })}</div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
