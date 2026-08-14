import { useEffect, useState } from "react";
import { api } from "./api";
import { topArtisans as mockTop, searchResults as mockSearch } from "../data/mockData";

// Fetches artisans from the live backend. If the backend isn't running
// (common when just previewing the frontend on its own), falls back to
// the bundled mock data so screens still render something useful, and
// flags `isLive: false` so callers/tests can tell the difference.
function normalize(a) {
  return {
    id: a.id,
    name: a.fullName || a.name,
    trade: a.trade,
    area: a.area,
    rating: a.rating || 0,
    price: a.hourlyRate ? `₦${Number(a.hourlyRate).toLocaleString()}/hr` : a.price || "—",
    verified: !!a.verified,
    bio: a.bio,
    reviewCount: a.reviewCount || 0,
    yearsExperience: a.yearsExperience,
  };
}

export function useArtisans(filters = {}, fallback = mockTop) {
  const [artisans, setArtisans] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .listArtisans(filters)
      .then((res) => {
        if (cancelled) return;
        setArtisans(res.artisans.map(normalize));
        setIsLive(true);
      })
      .catch(() => {
        if (cancelled) return;
        setArtisans(fallback);
        setIsLive(false);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { artisans, loading, isLive };
}

export { mockTop, mockSearch };
