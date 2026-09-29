import type { MeUser } from '@world-challenge/shared';
import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  user: MeUser | null;
  ready: boolean;
  setSession: (accessToken: string, user: MeUser) => void;
  setReady: (ready: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  ready: false,
  setSession: (accessToken, user) => set({ accessToken, user }),
  setReady: (ready) => set({ ready }),
  clear: () => set({ accessToken: null, user: null }),
}));
