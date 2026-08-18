import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

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

// Wraps every screen. On mobile it's a phone-sized frame; from the md
// breakpoint up it becomes a full-width desktop layout (no frame, no
// artificial max-width) — same route, same component, CSS handles the rest.
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
              <Route path="/" element={<Navigate to="/splash" replace />} />
              <Route path="/splash" element={<Splash />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/otp" element={<OtpVerification />} />
              <Route path="/auth/confirm" element={<AuthConfirm />} />
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/artisan-profile" element={<ArtisanProfile />} />
              <Route path="/booking-request" element={<BookingRequest />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              <Route path="/bookings" element={<MyBookings />} />
              <Route path="/profile" element={<CustomerProfile />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/rating" element={<Rating />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/saved-artisans" element={<SavedArtisans />} />
              <Route path="/my-reviews" element={<MyReviews />} />
              <Route path="/settings" element={<Settings />} />

              {/* Artisan journey */}
              <Route path="/artisan/build-profile" element={<ArtisanBuildProfile />} />
              <Route path="/artisan/portfolio" element={<ArtisanPortfolioUpload />} />
              <Route path="/artisan/kyc" element={<ArtisanKyc />} />
              <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />
              <Route path="/artisan/jobs" element={<ArtisanJobs />} />
              <Route path="/artisan/profile" element={<ArtisanProfileHome />} />
              <Route path="/artisan/payout" element={<PayoutDetails />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminModeration />} />
              <Route path="/admin/users" element={<AdminUsers />} />

              <Route path="*" element={<Navigate to="/splash" replace />} />
            </Routes>
          </PhoneFrame>
        </BrowserRouter>
      </AuthProvider>
  );
}
