import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

export default function RoleRoute({ role, children }) {
  const { user, isHydrating } = useAuth();

  return (
    <ProtectedRoute>
      {/* ProtectedRoute will show the loader during hydration and redirect if not authed */}
      {!isHydrating && user && user.role !== role ? (
        <Navigate 
          to={
            user.role === 'admin' ? '/admin' : 
            user.role === 'artisan' ? '/artisan/dashboard' : 
            '/home'
          } 
          replace 
        />
      ) : (
        children
      )}
    </ProtectedRoute>
  );
}
