import { NavLink, Outlet } from 'react-router-dom';
import { useUiStore } from '../../app/store/ui-store';
import { useAuthStore } from '../../features/auth/auth-store';
import { logoutAccount } from '../../services/api';
import { disconnectGameSocket } from '../../services/socket';

const NAV_ITEMS = [
  { to: '/', label: 'Lobby', hint: 'Home', compact: 'Lobby' },
  { to: '/discover', label: 'Players', hint: 'Discover', compact: 'Rivals' },
  { to: '/games', label: 'Arena', hint: 'Games', compact: 'Arena' },
  { to: '/passport', label: 'Passport', hint: 'Collection', compact: 'Book' },
  { to: '/profile', label: 'Pilot', hint: 'Profile', compact: 'Pilot' },
] as const;

function navClass(isActive: boolean): string {
  return [
    'flex items-center justify-between rounded-2xl border px-3 py-2.5 text-sm font-semibold transition-colors',
    isActive
      ? 'border-cyan/40 bg-cyan/10 text-paper shadow-glow'
      : 'border-transparent text-mist hover:border-white/10 hover:bg-white/5 hover:text-paper',
  ].join(' ');
}

export function AppShell() {
  const { sidebarOpen, toggleSidebar, closeSidebar } = useUiStore();
  const user = useAuthStore((state) => state.user);
  const clear = useAuthStore((state) => state.clear);

  return (
    <div className="relative z-10 min-h-screen lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <header className="flex items-center justify-between border-b border-magenta/20 bg-void/45 px-4 py-3 backdrop-blur-xl lg:hidden">
        <a href="/" className="font-display text-lg font-bold tracking-wide text-paper">
          WORLD CHALLENGE
        </a>
        <button
          type="button"
          className="rounded-xl border border-white/15 px-3 py-1 text-sm text-paper"
          onClick={toggleSidebar}
          aria-expanded={sidebarOpen}
          aria-controls="mobile-nav"
        >
          Menu
        </button>
      </header>

      <aside
        id="mobile-nav"
        className={[
          'border-r border-cyan/15 bg-panel/40 px-4 py-6 backdrop-blur-xl lg:sticky lg:top-0 lg:block lg:min-h-screen',
          sidebarOpen ? 'block' : 'hidden',
        ].join(' ')}
      >
        <p className="hidden font-display text-2xl font-extrabold tracking-[0.12em] text-paper lg:block">
          WORLD
          <span className="block text-cyan">CHALLENGE</span>
        </p>
        <p className="mt-3 hidden text-xs uppercase tracking-[0.18em] text-mist lg:block">
          Social culture arena
        </p>
        <nav aria-label="Primary" className="mt-8 flex flex-col gap-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => navClass(isActive)}
              onClick={closeSidebar}
            >
              <span>{item.label}</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-mist">
                {item.hint}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 hidden rounded-2xl border border-magenta/25 bg-void/50 p-4 shadow-uv lg:block">
          {user ? (
            <>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold">Signed in</p>
              <p className="mt-2 font-display text-lg font-bold">{user.username}</p>
              <p className="mt-1 text-xs leading-5 text-mist">
                Lv {user.level} · {user.xp} XP · {user.country.flagEmoji} {user.country.name}
              </p>
              <button
                type="button"
                className="mt-3 text-xs font-semibold uppercase tracking-wider text-ember"
                onClick={() => {
                  void logoutAccount().finally(() => {
                    disconnectGameSocket();
                    clear();
                  });
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold">Guest</p>
              <p className="mt-2 font-display text-lg font-bold">Sign in to play</p>
              <NavLink to="/login" className="mt-2 inline-block text-xs font-semibold text-cyan">
                Login
              </NavLink>
              <span className="mx-2 text-mist">·</span>
              <NavLink to="/register" className="text-xs font-semibold text-cyan">
                Register
              </NavLink>
            </>
          )}
        </div>
      </aside>

      <div className="pb-20 lg:pb-0">
        <Outlet />
      </div>

      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 gap-1 border-t border-magenta/20 bg-panel/50 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            aria-label={item.label}
            className={({ isActive }) =>
              [
                'min-w-0 rounded-xl px-0.5 py-2 text-center text-[11px] font-semibold leading-tight',
                isActive ? 'bg-cyan/15 text-cyan' : 'text-paper/80',
              ].join(' ')
            }
          >
            {item.compact}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
