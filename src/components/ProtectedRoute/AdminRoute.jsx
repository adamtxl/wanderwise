import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function AdminRoute() {
  const isAdmin = useSelector((state) => state.user.isAdmin);

  return isAdmin ? <Outlet /> : <Navigate to="/non-admin-landing" />;
}

export default AdminRoute;
