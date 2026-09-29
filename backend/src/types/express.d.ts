import type { AuthUser } from '../common/auth/auth-user';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
