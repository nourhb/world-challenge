import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PageState } from '../../components/ui/PageState';
import { useAuthStore } from '../../features/auth/auth-store';
import { getMe, logoutAccount, updateMe } from '../../services/api';
import { disconnectGameSocket } from '../../services/socket';

const profileSchema = z.object({
  bio: z.string().max(280).optional(),
  language: z.string().max(16).optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);
  const clear = useAuthStore((state) => state.clear);
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({ queryKey: ['me'], queryFn: getMe });
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      bio: meQuery.data?.bio ?? '',
      language: meQuery.data?.language ?? 'en',
    },
  });

  const saveMutation = useMutation({
    mutationFn: (values: ProfileValues) => updateMe(values),
    onSuccess: (user) => {
      if (accessToken) {
        setSession(accessToken, user);
      }
      void queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  async function handleLogout(): Promise<void> {
    await logoutAccount();
    disconnectGameSocket();
    clear();
  }

  if (meQuery.isPending) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PageState title="Loading" body="Loading your profile from /users/me…" />
      </main>
    );
  }

  if (meQuery.isError || !meQuery.data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PageState title="Error" body="Your profile could not be loaded." />
      </main>
    );
  }

  const me = meQuery.data;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <section className="rounded-[28px] border border-white/10 bg-panel/80 p-6 lg:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
          Pilot
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold uppercase">{me.username}</h1>
        <p className="mt-2 text-sm text-mist">
          {me.country.flagEmoji} {me.country.name} · {me.email}
        </p>
        <p className="mt-1 text-sm text-mist">
          Level {me.level} · {me.rankTitle} · {me.xp} XP
        </p>
        <p className="mt-3 text-sm text-mist">
          Signup country code: {me.signupCountryIso2 ?? 'unknown'}
        </p>
        <p className="text-sm text-mist">
          Last login:{' '}
          {me.lastLoginAt ? new Date(me.lastLoginAt).toLocaleString() : 'just now'}
          {me.lastLoginCountryIso2 ? ` · ${me.lastLoginCountryIso2}` : ''}
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
        >
          <label className="block text-sm font-semibold">
            Bio
            <textarea
              className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3"
              rows={4}
              {...form.register('bio')}
            />
          </label>
          <label className="block text-sm font-semibold">
            Language
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-void px-4 py-3"
              {...form.register('language')}
            />
          </label>
          {saveMutation.isError ? (
            <p className="text-sm text-ember">
              {saveMutation.error instanceof Error
                ? saveMutation.error.message
                : 'Save failed'}
            </p>
          ) : null}
          <button
            type="submit"
            className="rounded-2xl bg-cyan px-5 py-3 text-sm font-bold uppercase tracking-wide text-void"
          >
            Save profile
          </button>
        </form>

        <button
          type="button"
          onClick={() => void handleLogout()}
          className="mt-6 rounded-2xl border border-ember/40 px-5 py-3 text-sm font-semibold text-ember"
        >
          Log out
        </button>
      </section>
    </main>
  );
}
