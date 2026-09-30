import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { GuestOnly } from '../../features/auth/GuestOnly';
import { ProtectedRoute } from '../../features/auth/ProtectedRoute';
import { useAuthStore } from '../../features/auth/auth-store';
import { ForgotPasswordPage } from '../../pages/Auth/ForgotPasswordPage';
import { LoginPage } from '../../pages/Auth/LoginPage';
import { RegisterPage } from '../../pages/Auth/RegisterPage';
import { ResetPasswordPage } from '../../pages/Auth/ResetPasswordPage';
import { ComingSoonPage } from '../../pages/ComingSoon/ComingSoonPage';
import { DiscoverPage } from '../../pages/Discover/DiscoverPage';
import { GameSessionPage } from '../../pages/Games/GameSessionPage';
import { GamesPage } from '../../pages/Games/GamesPage';
import { HomePage } from '../../pages/Home/HomePage';
import { LandingPage } from '../../pages/Landing/LandingPage';
import { PassportPage } from '../../pages/Passport/PassportPage';
import { ProfilePage } from '../../pages/Profile/ProfilePage';
import { UserProfilePage } from '../../pages/Profile/UserProfilePage';
import { LeaderboardPage } from '../../pages/Ranks/LeaderboardPage';

function RootPage() {
  const { user, ready } = useAuthStore();
  if (!ready) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm text-mist">Loading lobby…</p>
      </main>
    );
  }
  return user ? <HomePage /> : <LandingPage />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<RootPage />} />
          <Route element={<GuestOnly />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games/:id" element={<GameSessionPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/passport" element={<PassportPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />
          </Route>
          <Route
            path="/settings"
            element={
              <ComingSoonPage
                title="Settings"
                phase="Later"
                summary="Privacy, block lists, and account deletion remain later-phase work."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
