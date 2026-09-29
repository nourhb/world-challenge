import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '../../features/auth/auth-store';
import { NeonArenaBackground } from '../../features/fx/NeonArenaBackground';
import { bootstrapSession } from '../../services/api';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const setReady = useAuthStore((state) => state.setReady);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  useEffect(() => {
    void bootstrapSession().finally(() => setReady(true));
  }, [setReady]);

  return (
    <QueryClientProvider client={queryClient}>
      <NeonArenaBackground />
      {children}
    </QueryClientProvider>
  );
}
