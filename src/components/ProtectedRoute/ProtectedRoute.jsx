import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userLoading = useSelector((state) => state.user.loading); // Assuming you have a loading state in Redux

  if (userLoading) {
    // Show a loading spinner or nothing until the user's session is checked
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;