# Database

Provider: PostgreSQL  
ORM: Prisma  
Schema: `backend/prisma/schema.prisma`

## Models in the vertical slice

| Model | Role |
|---|---|
| `Country` | ISO reference data (40 seeded countries) |
| `User` | Accounts, XP, level, home country |
| `RefreshToken` | Hashed rotating refresh tokens |
| `UserCountry` | Passport stamps |
| `Game` | Game catalog |
| `GameSession` | Solo or 1v1 room |
| `GamePlayer` | Membership, score, ready, XP awarded |
| `Question` | Quiz prompts; `correctAnswer` never sent before submission |
| `GameAnswer` | One answer per player per question |
| `Badge` / `UserBadge` | Achievement definitions and awards |
| `Block` | Hidden from discover |

## Commands

```bash
docker compose up postgres -d
cd backend
npx prisma migrate deploy
npx prisma db seed
```

Demo users created by seed (Argon2id): `Nour` / `Alex`, password `DemoPass123!`.
