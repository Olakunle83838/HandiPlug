// Thin fetch wrapper around the HandiPlug backend (server/). Falls back
// gracefully (throws a typed error) so calling screens can decide whether
// to show a real error or fall back to demo data.
const BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:4000/api";

async function request(path, { method = "GET", body, token, formData } = {}) {
  const headers = {};
  if (!formData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: formData ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    const e = new Error("Can't reach the HandiPlug server. Is it running?");
    e.isNetworkError = true;
    throw e;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = new Error(data.error || `Request failed (${res.status})`);
    e.status = res.status;
    throw e;
  }
  return data;
}

export const api = {
  health: () => request("/health"),

  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: (token) => request("/auth/me", { token }),
  forgotPassword: (email) => request("/auth/forgot-password", { method: "POST", body: { email } }),
  changePassword: (payload, token) => request("/auth/change-password", { method: "PATCH", body: payload, token }),
  updateProfile: (payload, token) => request("/users/me", { method: "PATCH", body: payload, token }),

  listArtisans: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""));
    const query = qs.toString();
    return request(`/artisans${query ? `?${query}` : ""}`);
  },
  getArtisan: (id) => request(`/artisans/${id}`),

  createBooking: (payload, token) => request("/bookings", { method: "POST", body: payload, token }),
  myBookings: (token) => request("/bookings/mine", { token }),
  updateBooking: (id, status, token) => request(`/bookings/${id}`, { method: "PATCH", body: { status }, token }),

  createReview: (payload, token) => request("/reviews", { method: "POST", body: payload, token }),
  artisanReviews: (id) => request(`/reviews/artisan/${id}`),
  myReviews: (token) => request("/reviews/mine", { token }),

  submitKyc: (formData, token) => request("/kyc/submit", { method: "POST", body: formData, formData: true, token }),
  myKyc: (token) => request("/kyc/mine", { token }),

  adminStats: (token) => request("/admin/stats", { token }),
  adminQueue: (token) => request("/admin/verification-queue", { token }),
  adminDecide: (id, decision, token) => request(`/admin/verification/${id}`, { method: "PATCH", body: { decision }, token }),
  adminUsers: (token) => request("/admin/users", { token }),
};

export const API_BASE_URL = BASE_URL;
