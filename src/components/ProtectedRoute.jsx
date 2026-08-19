import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white md:bg-transparent h-full w-full">
      <div className="w-8 h-8 border-4 border-[#1C4CD1] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[#6B7280] text-sm font-medium">Verifying session...</p>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { isAuthed, isHydrating } = useAuth();
  const location = useLocation();

  if (isHydrating) {
    return <LoadingScreen />;
  }

  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
