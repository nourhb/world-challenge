import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from '../features/auth/auth-store';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (typeof window === 'undefined' ? 'http://127.0.0.1:5000' : window.location.origin);

let socket: Socket | null = null;

export function getSocket(): Socket {
  const token = useAuthStore.getState().accessToken;
  const currentAuth =
    socket && typeof socket.auth === 'object' && socket.auth
      ? (socket.auth as { token?: string }).token
      : undefined;

  if (socket && currentAuth !== token) {
    socket.disconnect();
    socket = null;
  }

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: { token },
    });
  } else {
    socket.auth = { token };
  }
  return socket;
}

export function connectGameSocket(): Socket {
  const next = getSocket();
  if (!next.connected) {
    next.connect();
  }
  return next;
}

export function disconnectGameSocket(): void {
  socket?.disconnect();
}
