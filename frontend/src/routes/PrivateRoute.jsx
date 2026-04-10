import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Layout/Sidebar';
import { useAuth } from '../context/AuthContext';

/**
 * Si no hay sesión, redirige a /login; si hay, muestra layout con sidebar.
 */
export function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="appShell">
      <Sidebar />
      <main className="appMain">
        <Outlet />
      </main>
    </div>
  );
}
