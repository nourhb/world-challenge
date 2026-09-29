import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from '../../features/auth/schemas';
import { requestPasswordReset } from '../../services/api';

export function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    message: string;
    resetUrl?: string;
  } | null>(null);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identifier: '' },
  });

  async function onSubmit(values: ForgotPasswordValues): Promise<void> {
    setServerError(null);
    try {
      const payload = await requestPasswordReset(values);
      setResult(payload);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Could not start a reset',
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
          Forgot password
        </h1>
        <p className="mt-3 text-sm text-mist">
          Enter the username or email on the account. If it exists, a one-time
          reset link is created and expires in 30 minutes.
        </p>

        {result ? (
          <div className="mt-6 rounded-2xl border border-cyan/30 bg-cyan/10 px-4 py-3 text-sm">
            <p>{result.message}</p>
            {result.resetUrl ? (
              <p className="mt-3">
                Local mode — no mail server is configured, so the live link is
                here:{' '}
                <a href={resetPath(result.resetUrl)} className="font-semibold text-gold">
                  Set a new password
                </a>
              </p>
            ) : null}
          </div>
        ) : (
          <>
            <label className="mt-6 block text-sm font-semibold">
              Username or email
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3 text-paper"
                autoComplete="username"
                {...form.register('identifier')}
              />
            </label>
            {form.formState.errors.identifier?.message ? (
              <p className="mt-1 text-xs text-ember">
                {form.formState.errors.identifier.message}
              </p>
            ) : null}

            {serverError ? (
              <p className="mt-4 text-sm text-ember">{serverError}</p>
            ) : null}

            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="mt-6 w-full rounded-2xl bg-gold px-5 py-3 font-display text-sm font-extrabold uppercase tracking-wide text-void"
            >
              {form.formState.isSubmitting ? 'Checking…' : 'Send reset link'}
            </button>
          </>
        )}

        <p className="mt-4 text-sm text-mist">
          Remembered it?{' '}
          <Link to="/login" className="text-cyan">
            Back to login
          </Link>
        </p>
      </form>
    </main>
  );
}

function resetPath(resetUrl: string): string {
  try {
    const parsed = new URL(resetUrl);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return resetUrl;
  }
}
