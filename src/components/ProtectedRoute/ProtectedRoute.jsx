import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userLoading = useSelector((state) => state.user.loading);
  const location = useLocation();

  if (userLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to landing page, preserving intended destination in state
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} />
  );
}

export default ProtectedRoute;
