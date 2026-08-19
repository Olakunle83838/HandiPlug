import { useEffect, useState } from "react";
import { api } from "./api";
import { topArtisans as mockTop, searchResults as mockSearch } from "../data/mockData";

// Fetches artisans from the live backend. If the backend isn't running
// (common when just previewing the frontend on its own), falls back to
// the bundled mock data — filtered client-side with the exact same rules
// the backend uses, so category/search filters still work correctly even
// without a server running.
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

function applyFiltersLocally(list, filters) {
  let out = list;
  if (filters.trade) {
    out = out.filter((a) => a.trade?.toLowerCase() === String(filters.trade).toLowerCase());
  }
  if (filters.area) {
    out = out.filter((a) => a.area?.toLowerCase().includes(String(filters.area).toLowerCase()));
  }
  if (filters.verified === "true") {
    out = out.filter((a) => a.verified);
  }
  if (filters.minRating) {
    out = out.filter((a) => (a.rating || 0) >= Number(filters.minRating));
  }
  if (filters.q) {
    const needle = String(filters.q).toLowerCase();
    out = out.filter(
      (a) =>
        a.name?.toLowerCase().includes(needle) ||
        a.trade?.toLowerCase().includes(needle) ||
        a.area?.toLowerCase().includes(needle)
    );
  }
  return out;
}

export function useArtisans(filters = {}, fallback = mockTop) {
  const [artisans, setArtisans] = useState(() => applyFiltersLocally(fallback, filters));
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // setLoading(true);
    api
      .listArtisans(filters)
      .then((res) => {
        if (cancelled) return;
        setArtisans(res.artisans.map(normalize));
        setIsLive(true);
      })
      .catch(() => {
        if (cancelled) return;
        setArtisans(applyFiltersLocally(fallback, filters));
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
