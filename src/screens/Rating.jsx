import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StatusSpace, Avatar, Button } from "../components/UI";
import TopNav from "../components/TopNav";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Rating() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const artisanId = params.get("artisanId") || "u_musa"; // demo fallback for the Payment flow
  const bookingId = params.get("bookingId");
  const { token, isAuthed } = useAuth();

  const [artisan, setArtisan] = useState({ fullName: "Musa Sani", trade: "Plumber" });
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getArtisan(artisanId).then((res) => setArtisan(res.artisan)).catch(() => {});
  }, [artisanId]);

  const submit = async () => {
    setError("");
    if (!isAuthed) {
      navigate("/login");
      return;
    }
    if (rating === 0) {
      setError("Tap a star to rate your artisan.");
      return;
    }
    setLoading(true);
    try {
      await api.createReview({ artisanId, bookingId, rating, comment: review }, token);
      setDone(true);
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Stars = ({ size = "text-4xl" }) => (
    <div className="flex gap-2 pt-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} onClick={() => setRating(i)} className={`${size} ${i <= rating ? "text-[#FACC15]" : "text-[#E5E7EB]"}`}>★</button>
      ))}
    </div>
  );

  const Review = () => (
    <textarea
      value={review}
      onChange={(e) => setReview(e.target.value)}
      placeholder="Did a solid job, arrived on time and cleaned up after. Would book again."
      rows={5}
      className="w-full border border-[#E5E7EB] rounded-2xl p-4 text-[15px] text-[#1F2937] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF7A00] resize-none mt-2"
    />
  );

  return (
    <div className="bg-white flex flex-col h-full w-full">
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden flex flex-col h-full w-full">
        <StatusSpace />
        <div className="flex-1 flex flex-col items-center px-6 pt-4 gap-4">
          <h1 className="text-[#1F2937] text-xl font-bold self-start">Rate your artisan</h1>
          <Avatar size={120} />
          <p className="text-[#1F2937] text-xl font-bold">{artisan.fullName}</p>
          <p className="text-[#6B7280] text-sm text-center">{artisan.trade}</p>
          {Stars({})}
          {Review()}
          {error && <p className="text-[#EF4444] text-sm">{error}</p>}
          {done && <p className="text-[#22C55E] text-sm">✓ Review submitted — thank you!</p>}
        </div>
        <div className="p-6">
          <Button onClick={submit} disabled={loading || done}>
            {loading ? "Submitting..." : done ? "Submitted ✓" : "Submit Review"}
          </Button>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex md:flex-col md:h-full md:w-full">
        <TopNav variant="app" />
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <h1 className="text-[#1F2937] text-3xl font-bold mb-1">How was your experience?</h1>
          <p className="text-[#6B7280] text-base mb-6">Rate your job with {artisan.fullName} — {artisan.trade}</p>
          <div className="border border-[#E5E7EB] rounded-2xl p-8 w-full max-w-[460px] flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Avatar size={56} />
              <div>
                <p className="text-[#1F2937] text-lg font-bold">{artisan.fullName}</p>
                <p className="text-[#6B7280] text-sm">{artisan.trade}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 py-3">
              <p className="text-[#6B7280] text-xs font-bold">YOUR RATING</p>
              {Stars({size: "text-3xl"})}
            </div>
            <p className="text-[#6B7280] text-xs font-bold">WRITE A REVIEW</p>
            {Review()}
            {error && <p className="text-[#EF4444] text-sm">{error}</p>}
            {done && <p className="text-[#22C55E] text-sm">✓ Review submitted — thank you!</p>}
            <Button className="mt-3" onClick={submit} disabled={loading || done}>
              {loading ? "Submitting..." : done ? "Submitted ✓" : "Submit Review"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
