import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './auth-store';

export function GuestOnly() {
  const { user, ready } = useAuthStore();

  if (!ready) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm text-mist">Loading…</p>
      </main>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
