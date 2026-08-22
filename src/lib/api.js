// Thin fetch wrapper around the HandiPlug backend.
// Uses VITE_API_URL when provided, otherwise falls back to /api.

const BASE_URL =
  import.meta.env?.PROD ? "/api" : (import.meta.env?.VITE_API_URL || "/api");

async function request(
  path,
  {
    method = "GET",
    body,
    token,
    formData,
  } = {}
) {
  const headers = {};

  if (!formData) {
    headers["Content-Type"] =
      "application/json";
  }

  if (token) {
    headers["Authorization"] =
      `Bearer ${token}`;
  }

  let res;

  try {
    res = await fetch(
      `${BASE_URL}${path}`,
      {
        method,
        headers,
        body: formData
          ? body
          : body
            ? JSON.stringify(body)
            : undefined,
      }
    );
  } catch (err) {
    const error = new Error(
      "Can't reach the HandiPlug server. Is it running?"
    );

    error.isNetworkError = true;

    throw error;
  }

  const data =
    await res
      .json()
      .catch(() => ({}));

  if (!res.ok) {
    const error = new Error(
      data.error ||
        `Request failed (${res.status})`
    );

    error.status =
      res.status;

    error.code =
      data.code;

    throw error;
  }

  return data;
}

export const api = {

  /*
  |--------------------------------------------------------------------------
  | HEALTH
  |--------------------------------------------------------------------------
  */

  health: () =>
    request("/health"),


  /*
  |--------------------------------------------------------------------------
  | AUTHENTICATION
  |--------------------------------------------------------------------------
  */

  register: (payload) =>
    request(
      "/auth/register",
      {
        method: "POST",
        body: payload,
      }
    ),

  verifyOtp: (payload) =>
    request(
      "/auth/verify-otp",
      {
        method: "POST",
        body: payload,
      }
    ),

  resendOtp: (payload) =>
    request(
      "/auth/resend-otp",
      {
        method: "POST",
        body: payload,
      }
    ),

  login: (payload) =>
    request(
      "/auth/login",
      {
        method: "POST",
        body: payload,
      }
    ),

  me: (token) =>
    request(
      "/auth/me",
      {
        token,
      }
    ),

  forgotPassword: (email) =>
    request(
      "/auth/forgot-password",
      {
        method: "POST",
        body: {
          email,
        },
      }
    ),

  changePassword: (
    payload,
    token
  ) =>
    request(
      "/auth/change-password",
      {
        method: "PATCH",
        body: payload,
        token,
      }
    ),


  /*
  |--------------------------------------------------------------------------
  | USERS
  |--------------------------------------------------------------------------
  */

  updateProfile: (
    payload,
    token
  ) =>
    request(
      "/users/me",
      {
        method: "PATCH",
        body: payload,
        token,
      }
    ),

  getAvatarUploadUrl: (
    payload,
    token
  ) =>
    request(
      "/users/avatar/upload-url",
      {
        method: "POST",
        body: payload,
        token,
      }
    ),

  confirmAvatarUpload: (
    payload,
    token
  ) =>
    request(
      "/users/avatar/confirm",
      {
        method: "POST",
        body: payload,
        token,
      }
    ),


  /*
  |--------------------------------------------------------------------------
  | ARTISANS
  |--------------------------------------------------------------------------
  */

  listArtisans: (
    params = {}
  ) => {
    const qs =
      new URLSearchParams(
        Object.entries(params).filter(
          ([, value]) =>
            value !== undefined &&
            value !== ""
        )
      );

    const query =
      qs.toString();

    return request(
      `/artisans${
        query
          ? `?${query}`
          : ""
      }`
    );
  },

  getArtisan: (id) =>
    request(
      `/artisans/${id}`
    ),

  getPortfolioUploadUrl: (
    payload,
    token
  ) =>
    request(
      "/artisans/portfolio/upload-url",
      {
        method: "POST",
        body: payload,
        token,
      }
    ),

  confirmPortfolioUpload: (
    payload,
    token
  ) =>
    request(
      "/artisans/portfolio/confirm",
      {
        method: "POST",
        body: payload,
        token,
      }
    ),


  /*
  |--------------------------------------------------------------------------
  | BOOKINGS
  |--------------------------------------------------------------------------
  */

  createBooking: (
    payload,
    token
  ) =>
    request(
      "/bookings",
      {
        method: "POST",
        body: payload,
        token,
      }
    ),

  myBookings: (token) =>
    request(
      "/bookings/mine",
      {
        token,
      }
    ),

  updateBooking: (
    id,
    status,
    token
  ) =>
    request(
      `/bookings/${id}`,
      {
        method: "PATCH",
        body: {
          status,
        },
        token,
      }
    ),


  /*
  |--------------------------------------------------------------------------
  | REVIEWS
  |--------------------------------------------------------------------------
  */

  createReview: (
    payload,
    token
  ) =>
    request(
      "/reviews",
      {
        method: "POST",
        body: payload,
        token,
      }
    ),

  artisanReviews: (id) =>
    request(
      `/reviews/artisan/${id}`
    ),

  myReviews: (token) =>
    request(
      "/reviews/mine",
      {
        token,
      }
    ),


  /*
  |--------------------------------------------------------------------------
  | KYC
  |--------------------------------------------------------------------------
  */

  getKycUploadUrl: (
    payload,
    token
  ) =>
    request(
      "/kyc/upload-url",
      {
        method: "POST",
        body: payload,
        token,
      }
    ),

  submitKyc: (
    payload,
    token
  ) =>
    request(
      "/kyc/submit",
      {
        method: "POST",
        body: payload,
        token,
      }
    ),

  myKyc: (token) =>
    request(
      "/kyc/mine",
      {
        token,
      }
    ),


  /*
  |--------------------------------------------------------------------------
  | MESSAGES
  |--------------------------------------------------------------------------
  */

  getMessages: (
    bookingId,
    token
  ) =>
    request(
      `/messages/${bookingId}`,
      {
        token,
      }
    ),

  sendMessage: (
    payload,
    token
  ) =>
    request(
      "/messages",
      {
        method: "POST",
        body: payload,
        token,
      }
    ),


  /*
  |--------------------------------------------------------------------------
  | NOTIFICATIONS
  |--------------------------------------------------------------------------
  */

  getNotifications: (
    token
  ) =>
    request(
      "/notifications",
      {
        token,
      }
    ),

  markNotificationRead: (
    id,
    token
  ) =>
    request(
      `/notifications/${id}/read`,
      {
        method: "PATCH",
        token,
      }
    ),


  /*
  |--------------------------------------------------------------------------
  | ADMIN
  |--------------------------------------------------------------------------
  */

  adminStats: (
    token
  ) =>
    request(
      "/admin/stats",
      {
        token,
      }
    ),

  adminQueue: (
    token
  ) =>
    request(
      "/admin/verification-queue",
      {
        token,
      }
    ),

  adminDecide: (
    id,
    decision,
    token
  ) =>
    request(
      `/admin/verification/${id}`,
      {
        method: "PATCH",
        body: {
          decision,
        },
        token,
      }
    ),

  adminUsers: (
    token
  ) =>
    request(
      "/admin/users",
      {
        token,
      }
    ),

  adminSuspendUser: (
    id,
    isSuspended,
    token
  ) =>
    request(
      `/admin/users/${id}/suspend`,
      {
        method: "PATCH",
        body: {
          isSuspended,
        },
        token,
      }
    ),
};

export const API_BASE_URL =
  BASE_URL;