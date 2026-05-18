import { useAuth } from "../store/authStore";
import { Navigate, Outlet } from "react-router";

function ProtectedRoute({ children, allowedRoles }) {
  //  Get user status from store
  const { loading, currentUser, isAuthenticated } = useAuth();

  //  Handle loading state
  if (loading) {
    return (
      <p className="text-center mt-10 text-stone-500 font-medium italic animate-pulse">
        Checking access...
      </p>
    );
  }

  //  If user not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //  Debugging logs (optional but helpful)
  console.log("Current User Role:", currentUser?.role);
  console.log("Allowed Roles:", allowedRoles);

  //  check roles if allowedRoles is provided
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    // Redirect to your unauthorized page and tell it where to go next (e.g. Home)
    return <Navigate to="/unauthorize" replace state={{ redirectTo: "/" }} />;
  }

  //  Return children (if passed directly) OR Outlet (for nested routes in App.jsx)
  return children || <Outlet />;
}

export default ProtectedRoute;