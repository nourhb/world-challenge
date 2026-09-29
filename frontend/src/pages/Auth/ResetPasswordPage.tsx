import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from '../../features/auth/schemas';
import { resetPassword } from '../../services/api';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: '', confirmPassword: '' },
  });

  useEffect(() => {
    form.setValue('token', token);
  }, [form, token]);

  async function onSubmit(values: ResetPasswordValues): Promise<void> {
    setServerError(null);
    try {
      await resetPassword({ token: values.token, password: values.password });
      navigate('/login', { replace: true, state: { passwordReset: true } });
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Could not reset the password',
      );
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-[28px] border border-white/10 bg-panel/80 p-6 lg:p-8"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
          Recovery
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase">
          New password
        </h1>
        <p className="mt-3 text-sm text-mist">
          Choose a new password. This link works once and then all old sessions
          are signed out.
        </p>

        <input type="hidden" {...form.register('token')} />
        {form.formState.errors.token?.message ? (
          <p className="mt-4 text-sm text-ember">
            {form.formState.errors.token.message}
          </p>
        ) : null}

        <label className="mt-6 block text-sm font-semibold">
          New password
          <input
            type="password"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-paper"
            autoComplete="new-password"
            {...form.register('password')}
          />
        </label>
        {form.formState.errors.password?.message ? (
          <p className="mt-1 text-xs text-ember">
            {form.formState.errors.password.message}
          </p>
        ) : null}

        <label className="mt-4 block text-sm font-semibold">
          Confirm password
          <input
            type="password"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-paper"
            autoComplete="new-password"
            {...form.register('confirmPassword')}
          />
        </label>
        {form.formState.errors.confirmPassword?.message ? (
          <p className="mt-1 text-xs text-ember">
            {form.formState.errors.confirmPassword.message}
          </p>
        ) : null}

        {serverError ? <p className="mt-4 text-sm text-ember">{serverError}</p> : null}

        <button
          type="submit"
          disabled={form.formState.isSubmitting || !token}
          className="mt-6 w-full rounded-2xl bg-gold px-5 py-3 font-display text-sm font-extrabold uppercase tracking-wide text-void disabled:opacity-50"
        >
          {form.formState.isSubmitting ? 'Saving…' : 'Update password'}
        </button>
        <p className="mt-4 text-sm text-mist">
          <Link to="/forgot-password" className="text-cyan">
            Request a new link
          </Link>
        </p>
      </form>
    </main>
  );
}
