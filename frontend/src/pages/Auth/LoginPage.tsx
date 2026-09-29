import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/auth-store';
import { loginSchema, type LoginValues } from '../../features/auth/schemas';
import { getGeoLocation, loginAccount } from '../../services/api';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const [serverError, setServerError] = useState<string | null>(null);
  const geoQuery = useQuery({
    queryKey: ['geo-location'],
    queryFn: getGeoLocation,
  });
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  async function onSubmit(values: LoginValues): Promise<void> {
    setServerError(null);
    try {
      const tokens = await loginAccount(values);
      setSession(tokens.accessToken, tokens.user);
      const from =
        typeof location.state === 'object' &&
        location.state !== null &&
        'from' in location.state &&
        typeof location.state.from === 'string'
          ? location.state.from
          : '/';
      navigate(from, { replace: true });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Login failed');
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-[28px] border border-white/10 bg-panel/80 p-6 lg:p-8"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
          Sign in
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase">
          Back to the arena
        </h1>
        <p className="mt-3 text-sm text-mist">
          Username or email plus password. Session cookies stay on this app origin.
        </p>
        {geoQuery.data?.country ? (
          <p className="mt-3 rounded-2xl border border-cyan/30 bg-cyan/10 px-4 py-3 text-sm">
            This network looks like {geoQuery.data.country.flagEmoji}{' '}
            {geoQuery.data.country.name}
            {geoQuery.data.city ? ` · ${geoQuery.data.city}` : ''} (IP {geoQuery.data.ip}).
          </p>
        ) : null}

        <label className="mt-6 block text-sm font-semibold">
          Username or email
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-paper"
            autoComplete="username"
            {...form.register('identifier')}
          />
        </label>
        <FieldError message={form.formState.errors.identifier?.message} />

        <label className="mt-4 block text-sm font-semibold">
          Password
          <input
            type="password"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-paper"
            autoComplete="current-password"
            {...form.register('password')}
          />
        </label>
        <FieldError message={form.formState.errors.password?.message} />

        {serverError ? <p className="mt-4 text-sm text-ember">{serverError}</p> : null}

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mt-6 w-full rounded-2xl bg-gold px-5 py-3 font-display text-sm font-extrabold uppercase tracking-wide text-void"
        >
          {form.formState.isSubmitting ? 'Signing in…' : 'Enter lobby'}
        </button>
        <p className="mt-4 text-sm text-mist">
          New here?{' '}
          <Link to="/register" className="text-cyan">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="mt-1 text-xs text-ember">{message}</p>;
}
