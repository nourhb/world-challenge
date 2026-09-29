import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { PageState } from '../../components/ui/PageState';
import { useAuthStore } from '../../features/auth/auth-store';
import { registerSchema, type RegisterValues } from '../../features/auth/schemas';
import { getCountries, getGeoLocation, registerAccount } from '../../services/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [serverError, setServerError] = useState<string | null>(null);
  const countriesQuery = useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
  });
  const geoQuery = useQuery({
    queryKey: ['geo-location'],
    queryFn: getGeoLocation,
  });
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      countryId: '',
      dateOfBirth: '',
      termsAccepted: false,
    },
  });

  useEffect(() => {
    const detectedId = geoQuery.data?.country?.id;
    if (detectedId && !form.getValues('countryId')) {
      form.setValue('countryId', detectedId, { shouldValidate: true });
    }
  }, [form, geoQuery.data]);

  async function onSubmit(values: RegisterValues): Promise<void> {
    setServerError(null);
    try {
      const tokens = await registerAccount({
        username: values.username,
        email: values.email,
        password: values.password,
        countryId: values.countryId,
        dateOfBirth: values.dateOfBirth,
        termsAccepted: values.termsAccepted,
      });
      setSession(tokens.accessToken, tokens.user);
      navigate('/', { replace: true });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-[28px] border border-white/10 bg-panel/80 p-6 lg:p-8"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
          Create account
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase">
          Choose your country
        </h1>
        <p className="mt-3 text-sm text-mist">
          We detect your country from this network IP. Change it if the lookup is wrong.
          You must be 18+.
        </p>
        {geoQuery.data?.country ? (
          <p className="mt-3 rounded-2xl border border-cyan/30 bg-cyan/10 px-4 py-3 text-sm text-paper">
            Detected from IP {geoQuery.data.ip}
            {geoQuery.data.city ? ` · ${geoQuery.data.city}` : ''}:{' '}
            {geoQuery.data.country.flagEmoji} {geoQuery.data.country.name}
          </p>
        ) : geoQuery.isError ? (
          <p className="mt-3 text-sm text-ember">
            IP country lookup failed. Choose your country manually.
          </p>
        ) : (
          <p className="mt-3 text-sm text-mist">Reading your network location…</p>
        )}

        {countriesQuery.isPending ? (
          <div className="mt-6">
            <PageState title="Loading" body="Fetching countries from the API…" />
          </div>
        ) : countriesQuery.isError ? (
          <div className="mt-6">
            <PageState
              title="Countries unavailable"
              body="The country list could not be loaded. Start the backend and refresh."
            />
          </div>
        ) : (
          <>
            <label className="mt-6 block text-sm font-semibold">
              Username
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3"
                autoComplete="username"
                {...form.register('username')}
              />
            </label>
            <FieldError message={form.formState.errors.username?.message} />

            <label className="mt-4 block text-sm font-semibold">
              Email
              <input
                type="email"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3"
                autoComplete="email"
                {...form.register('email')}
              />
            </label>
            <FieldError message={form.formState.errors.email?.message} />

            <label className="mt-4 block text-sm font-semibold">
              Home country
              <select
                className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3"
                {...form.register('countryId')}
              >
                <option value="">Select a country</option>
                {countriesQuery.data.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.flagEmoji ? `${country.flagEmoji} ` : ''}
                    {country.name}
                  </option>
                ))}
              </select>
            </label>
            <FieldError message={form.formState.errors.countryId?.message} />

            <label className="mt-4 block text-sm font-semibold">
              Date of birth
              <input
                type="date"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3"
                {...form.register('dateOfBirth')}
              />
            </label>
            <FieldError message={form.formState.errors.dateOfBirth?.message} />

            <label className="mt-4 block text-sm font-semibold">
              Password
              <input
                type="password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3"
                autoComplete="new-password"
                {...form.register('password')}
              />
            </label>
            <FieldError message={form.formState.errors.password?.message} />

            <label className="mt-4 block text-sm font-semibold">
              Confirm password
              <input
                type="password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3"
                autoComplete="new-password"
                {...form.register('confirmPassword')}
              />
            </label>
            <FieldError message={form.formState.errors.confirmPassword?.message} />

            <label className="mt-4 flex items-start gap-3 text-sm text-mist">
              <input type="checkbox" className="mt-1" {...form.register('termsAccepted')} />
              I am 18+ and accept the World Challenge terms.
            </label>
            <FieldError message={form.formState.errors.termsAccepted?.message} />

            {serverError ? <p className="mt-4 text-sm text-ember">{serverError}</p> : null}

            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="mt-6 w-full rounded-2xl bg-gold px-5 py-3 font-display text-sm font-extrabold uppercase tracking-wide text-void"
            >
              {form.formState.isSubmitting ? 'Creating…' : 'Create account'}
            </button>
          </>
        )}

        <p className="mt-4 text-sm text-mist">
          Already registered?{' '}
          <Link to="/login" className="text-cyan">
            Log in
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
