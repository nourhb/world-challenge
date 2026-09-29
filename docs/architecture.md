# Architecture

World Challenge is a monorepo with three packages:

| Package | Role |
|---|---|
| `frontend` | React + TypeScript + Vite client |
| `backend` | NestJS API and future Socket.IO gateway |
| `shared` | Cross-package enums, API types, and progression constants |

```text
React Frontend                Admin Dashboard (later)
        \                    /
         HTTPS / WSS
                |
         NestJS Backend
        /       |        \
   REST API  WebSocket   Auth
                |
         Application services
                |
            Prisma ORM
                |
            PostgreSQL
```

## Current scope

The first usable prototype is implemented:

- Authentication (JWT access + httpOnly refresh, Argon2id)
- Countries and virtual passport
- Player discovery
- Country Quiz solo and 1v1 over Socket.IO
- Server-authoritative scoring, XP, and passport unlocks

Chat, admin, and the other mini-games remain later-phase work.

## Design principles already in place

- TypeScript strict mode
- Consistent API envelope (`success` / `data` / `error`)
- Server-side business logic (no client scoring)
- Environment files with no committed secrets
- Modular NestJS modules and feature-based frontend folders

See `docs/technical-spec.md` for the full product specification.
