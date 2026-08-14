import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusSpace, Stars } from "../components/UI";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function MyReviews() {
  const navigate = useNavigate();
  const { token, isAuthed } = useAuth();
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    if (!isAuthed) return;
    api.myReviews(token).then((res) => setReviews(res.reviews)).catch(() => setReviews([]));
  }, [isAuthed, token]);

  const list = reviews || [];

  const Row = ({ r }) => (
    <div className="border border-[#E5E7EB] rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-[#1F2937] text-sm font-semibold">{r.artisanName} — {r.trade}</p>
        <Stars rating={r.rating} />
      </div>
      {r.comment && <p className="text-[#6B7280] text-sm">{r.comment}</p>}
      <p className="text-[#9CA3AF] text-xs">{new Date(r.createdAt).toLocaleDateString()}</p>
    </div>
  );

  const Empty = () => (
    <div className="text-center pt-8">
      <p className="text-[#6B7280] text-sm">
        {isAuthed ? "You haven't left any reviews yet." : "Log in to see reviews you've left."}
      </p>
      {!isAuthed && (
        <button onClick={() => navigate("/login")} className="text-[#FF7A00] text-sm font-semibold mt-2">
          Log In
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex items-center gap-3 px-6 pt-2">
          <button onClick={() => navigate(-1)} className="text-2xl text-[#1F2937]">‹</button>
          <h1 className="text-[#1F2937] text-2xl font-bold">Reviews I&apos;ve Left</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-4 flex flex-col gap-3 pb-4">
          {list.length === 0 ? <Empty /> : list.map((r) => <Row key={r.id} r={r} />)}
        </div>
        <BottomNav />
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" />
        <div className="flex-1 overflow-y-auto px-12 py-8">
          <div className="max-w-[800px] mx-auto flex flex-col gap-5">
            <h1 className="text-[#1F2937] text-2xl font-bold">Reviews I&apos;ve Left</h1>
            {list.length === 0 ? <Empty /> : <div className="flex flex-col gap-3">{list.map((r) => <Row key={r.id} r={r} />)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
