import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userLoading = useSelector((state) => state.user.loading);
  const location = useLocation(); // Get the current location (URL)

  if (userLoading) {
    // Show a loading spinner until the user's session is checked
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login, but preserve the current location in state
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
}

export default ProtectedRoute;