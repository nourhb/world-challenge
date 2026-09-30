# World Challenge

A social cultural-discovery game. Players meet people from other countries, play short culture games, and unlock countries in a virtual passport.

This repository now has a **usable vertical slice**: real auth, real countries, real discover, Country Quiz (solo + 1v1), server-side scoring, XP, and passport unlocks.

## How to run locally

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
npm install
docker compose up postgres -d
cd backend
npx prisma migrate deploy
npx prisma db seed
cd ..
npm run dev:backend
npm run dev:frontend
```

- Frontend: http://localhost:5180
- API: http://localhost:5000/api/v1/health
- Swagger: http://localhost:5000/swagger

PostgreSQL is on host port **5433**. User / password / database: `worldchallenge`.

## Go live

Production is **one HTTPS service**: Nest serves the API, Socket.IO, and the built React app from the same origin (so login cookies work). Postgres is on Neon.

1. The production database is the Neon project **world-challenge**. Copy its connection string from [Neon Console](https://console.neon.tech).
2. Open the GitHub repo and deploy with Render Blueprint:

   [Deploy to Render](https://render.com/deploy?repo=https://github.com/nourhb/world-challenge)

3. Paste `DATABASE_URL` when Render asks. Leave JWT secrets on **generate**.
4. After the first deploy, open the Render URL. Demo logins still work: **Nour** / **Alex**, password `DemoPass123!`.

The Docker image runs `prisma migrate deploy` and seed on boot, then `node dist/main.js`.

## Demo logins

Seeded through the same Argon2id register path (hashed passwords, not plaintext):

| Username | Email | Password | Country |
|---|---|---|---|
| Nour | nour@worldchallenge.local | `DemoPass123!` | Tunisia |
| Alex | alex@worldchallenge.local | `DemoPass123!` | Japan |

Use two browsers (or one normal + one private window) to play 1v1: log in as Nour, challenge Alex, then join as Alex from Home or the session link.

You can also register a new account. Country choices come from `GET /countries`.

## What is real now

- Register / login / refresh (httpOnly cookie) / logout / `GET /auth/me`
- Argon2id passwords + JWT access tokens
- Profile from `/users/me`
- Countries and passport from the database
- Discover other real users (no email leak)
- Country Quiz solo and 1v1
- Socket.IO ready / question / answer / results
- Server-authoritative scores, timers, XP, and passport stamps
- Unlock does not require winning; you cannot unlock your own country
- Rewards run in one idempotent transaction

## Later-phase (not in this slice)

- Chat / DMs
- Admin question dashboard
- Guess the Word, World Map, Cuisine, Music, Mime
- Random matchmaking, payments, video, voice, AI matching
- Full leaderboards, notifications UI, block/report screens

## Verify

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Full specification: `docs/technical-spec.md`




<img width="1920" height="1694" alt="screencapture-127-0-0-1-5180-2026-09-30-14_50_50" src="https://github.com/user-attachments/assets/6af8beac-035f-46cb-b7f9-4d7109fe9783" />
<img width="1920" height="915" alt="screencapture-127-0-0-1-5180-discover-2026-09-30-14_51_31" src="https://github.com/user-attachments/assets/1c703424-6ee6-4e94-8a33-1cebb194c06f" />
<img width="1920" height="1665" alt="screencapture-127-0-0-1-5180-games-2026-09-30-14_51_42" src="https://github.com/user-attachments/assets/8a063dd1-2341-4a93-9a9f-4b740ca4d412" />
<img width="1920" height="915" alt="screencapture-127-0-0-1-5180-leaderboard-2026-09-30-14_51_55" src="https://github.com/user-attachments/assets/b5336d65-595d-4acd-96ae-285d860bafaf" />
<img width="1920" height="1316" alt="screencapture-127-0-0-1-5180-passport-2026-09-30-14_52_04" src="https://github.com/user-attachments/assets/b72d6561-85b8-49e9-991d-66a8907d3c87" />
<img width="1920" height="915" alt="screencapture-127-0-0-1-5180-profile-2026-09-30-14_52_20" src="https://github.com/user-attachments/assets/51402bf6-124b-4fbb-a578-09bb8eb17d4c" />
<img width="1920" height="915" alt="screencapture-127-0-0-1-5180-games-cmuogq8360009013wglr1i952-2026-09-30-14_52_55" src="https://github.com/user-attachments/assets/0592d2a1-38ad-44e4-805c-172e07b27526" />

