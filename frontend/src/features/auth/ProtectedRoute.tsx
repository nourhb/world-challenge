import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from './auth-store';

export function ProtectedRoute() {
  const { user, ready } = useAuthStore();
  const location = useLocation();

  if (!ready) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm text-mist">Checking your session…</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
