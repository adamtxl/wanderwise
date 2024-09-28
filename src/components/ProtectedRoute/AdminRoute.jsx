import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AdminRoute() {
  const isAdmin = useSelector((state) => state.user.isAdmin);

  return isAdmin ? <Outlet /> : <Navigate to="/non-admin-landing" />;
}

export default AdminRoute;