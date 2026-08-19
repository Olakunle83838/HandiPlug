import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Splash from "./screens/Splash";
import Onboarding from "./screens/Onboarding";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import ForgotPassword from "./screens/ForgotPassword";
import OtpVerification from "./screens/OtpVerification";
import AuthConfirm from "./screens/AuthConfirm";
import Home from "./screens/Home";
import SearchResults from "./screens/SearchResults";
import ArtisanProfile from "./screens/ArtisanProfile";
import BookingRequest from "./screens/BookingRequest";
import Chat from "./screens/Chat";
import BookingConfirmation from "./screens/BookingConfirmation";
import MyBookings from "./screens/MyBookings";
import CustomerProfile from "./screens/CustomerProfile";
import Payment from "./screens/Payment";
import PaymentSuccess from "./screens/PaymentSuccess";
import Rating from "./screens/Rating";
import Notifications from "./screens/Notifications";
import ArtisanBuildProfile from "./screens/ArtisanBuildProfile";
import ArtisanPortfolioUpload from "./screens/ArtisanPortfolioUpload";
import ArtisanKyc from "./screens/ArtisanKyc";
import ArtisanDashboard from "./screens/ArtisanDashboard";
import ArtisanJobs from "./screens/ArtisanJobs";
import ArtisanProfileHome from "./screens/ArtisanProfileHome";
import AdminModeration from "./screens/AdminModeration";
import SavedArtisans from "./screens/SavedArtisans";
import MyReviews from "./screens/MyReviews";
import Settings from "./screens/Settings";
import PayoutDetails from "./screens/PayoutDetails";
import AdminUsers from "./screens/AdminUsers";

function PhoneFrame({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#e9edf1] md:bg-white flex items-center justify-center md:block">
      <div className="w-full max-w-[430px] h-screen sm:h-[932px] sm:max-h-[932px] bg-white sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative md:max-w-none md:h-screen md:rounded-none md:shadow-none md:overflow-visible">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PhoneFrame>
          <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/splash" replace />} />
              <Route path="/splash" element={<Splash />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/otp" element={<OtpVerification />} />
              <Route path="/auth/confirm" element={<AuthConfirm />} />

              {/* Protected Shared Routes (Customer & Artisan usually, maybe admin depending on context) */}
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
              <Route path="/artisan-profile" element={<ProtectedRoute><ArtisanProfile /></ProtectedRoute>} />
              <Route path="/booking-request" element={<ProtectedRoute><BookingRequest /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/booking-confirmation" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
              <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
              <Route path="/rating" element={<ProtectedRoute><Rating /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/saved-artisans" element={<ProtectedRoute><SavedArtisans /></ProtectedRoute>} />
              <Route path="/my-reviews" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

              {/* Artisan Routes */}
              <Route path="/artisan/build-profile" element={<RoleRoute role="artisan"><ArtisanBuildProfile /></RoleRoute>} />
              <Route path="/artisan/portfolio" element={<RoleRoute role="artisan"><ArtisanPortfolioUpload /></RoleRoute>} />
              <Route path="/artisan/kyc" element={<RoleRoute role="artisan"><ArtisanKyc /></RoleRoute>} />
              <Route path="/artisan/dashboard" element={<RoleRoute role="artisan"><ArtisanDashboard /></RoleRoute>} />
              <Route path="/artisan/jobs" element={<RoleRoute role="artisan"><ArtisanJobs /></RoleRoute>} />
              <Route path="/artisan/profile" element={<RoleRoute role="artisan"><ArtisanProfileHome /></RoleRoute>} />
              <Route path="/artisan/payout" element={<RoleRoute role="artisan"><PayoutDetails /></RoleRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<RoleRoute role="admin"><AdminModeration /></RoleRoute>} />
              <Route path="/admin/users" element={<RoleRoute role="admin"><AdminUsers /></RoleRoute>} />

              <Route path="*" element={<Navigate to="/splash" replace />} />
            </Routes>
          </PhoneFrame>
        </BrowserRouter>
      </AuthProvider>
  );
}
