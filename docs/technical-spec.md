# WORLD CHALLENGE
## Full Technical Specification & Cursor Build Document
### Version 1.0 — 2026-09-28

---

## 1. Project Overview

### 1.1 Product name

**World Challenge**

### 1.2 Product concept

World Challenge is a social, multiplayer mobile/web application built around cultural discovery and short games.

A user meets people from other countries and plays small culture-based games with them instead of only chatting. Successful games unlock countries in the user's **Virtual Passport**, award points, badges and experience, and increase the user's level.

Core product loop:

```text
Create account
   ↓
Complete profile + choose country
   ↓
Discover players from other countries
   ↓
Start conversation / challenge
   ↓
Play a cultural mini-game
   ↓
Earn XP + points + badge/progress
   ↓
Unlock opponent's country in passport
   ↓
Discover more countries
   ↓
Meet more people and play more games
```

The application must combine:

- Authentication
- User profiles
- Country selection
- Social discovery
- Real-time messaging
- Real-time multiplayer games
- Game matchmaking
- Country/culture database
- Virtual passport
- XP and levels
- Badges and achievements
- Leaderboards
- Notifications
- Moderation/reporting
- Admin management
- Responsive UI
- Secure REST APIs
- WebSocket communication

---

# 2. Product Goals

## 2.1 Primary goals

1. Make international interaction more engaging than ordinary chat.
2. Encourage users to learn about cultures through games.
3. Create a clear progression system.
4. Demonstrate networking, databases, authentication, real-time communication and application programming.
5. Support both single-player and multiplayer game modes.
6. Make the virtual passport the central progression feature.

## 2.2 Secondary goals

- Provide a visually attractive portfolio/academic project.
- Demonstrate modern full-stack development.
- Make the architecture extensible.
- Allow new mini-games to be added without rewriting the application.
- Provide an admin dashboard for content management.

## 2.3 Non-goals for MVP

Do NOT initially implement:

- Payments
- Cryptocurrency
- Complex recommendation AI
- Video calls
- Live voice chat
- Automatic public user-to-user matching without safety controls
- Complex AR passport effects
- Native music licensing infrastructure

These can be future features.

---

# 3. Target Platforms

## MVP recommendation

Build a responsive web application first, with architecture ready for mobile.

Recommended stack:

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Zustand or Redux Toolkit
- TanStack Query
- Socket.IO Client
- React Hook Form
- Zod
- Leaflet or MapLibre for map gameplay

### Backend

- Node.js
- TypeScript
- NestJS OR Express

**Recommended for this project: NestJS**

Reasons:

- Strong architecture
- Modules
- Controllers
- Services
- Guards
- WebSocket gateways
- Validation
- Dependency injection
- Easy scalability

### Database

- PostgreSQL
- Prisma ORM

### Real-time

- Socket.IO
- Redis adapter later if horizontal scaling is required

### Authentication

- JWT access token
- Refresh token
- Argon2 password hashing
- Optional Google authentication in a later phase

### File storage

MVP:

- Local storage for development

Production:

- S3-compatible object storage

### Deployment

Frontend:

- Vercel / Netlify

Backend:

- Render / Railway / Fly.io / VPS

Database:

- PostgreSQL provider

---

# 4. High-Level Architecture

```text
                         WORLD CHALLENGE
                               |
                +--------------+--------------+
                |                             |
          React Frontend                Admin Dashboard
                |                             |
                +--------------+--------------+
                               |
                         HTTPS / WSS
                               |
                     NestJS Backend API
                               |
        +----------------------+----------------------+
        |                      |                      |
   REST API              WebSocket Gateway       Auth Layer
        |                      |                      |
        +----------------------+----------------------+
                               |
                     Application Services
                               |
       +-----------+-----------+-----------+-----------+
       |           |           |           |           |
     Users       Games      Passport    Chat       Social
       |           |           |           |           |
       +-----------+-----------+-----------+-----------+
                               |
                           Prisma ORM
                               |
                         PostgreSQL DB
                               |
             +-----------------+----------------+
             |                                  |
        Redis Cache                       File Storage
```

---

# 5. Main Application Areas

The application must contain these main sections:

1. Landing page
2. Register
3. Login
4. Onboarding
5. Home dashboard
6. Discover people
7. User profile
8. Chat
9. Game selection
10. Game room
11. Results
12. Virtual passport
13. Countries
14. Leaderboard
15. Achievements
16. Notifications
17. Settings
18. Report/block system
19. Admin dashboard

---

# 6. User Roles

## 6.1 USER

Normal application user.

Permissions:

- Manage own profile
- Discover users
- Send messages
- Create game rooms
- Join games
- Play games
- Earn XP
- Unlock passport countries
- Earn badges
- Report users/content
- Block users

## 6.2 ADMIN

Administrative user.

Permissions:

- Manage users
- Manage countries
- Manage game questions
- Manage game categories
- Manage badges
- Review reports
- Suspend users
- Delete inappropriate content
- View system statistics

## 6.3 MODERATOR

Optional future role.

Permissions:

- Review reports
- Suspend users temporarily
- Moderate content

---

# 7. User Journey

## 7.1 Registration

User enters:

- Username
- Email
- Password
- Country
- Date of birth / age confirmation
- Optional profile photo
- Short bio

Validation:

- Email must be valid
- Username must be unique
- Password minimum 8 characters
- Country must exist
- User must accept Terms and Privacy Policy

After registration:

```text
Register
↓
Verify email
↓
Onboarding
↓
Choose interests
↓
Profile created
↓
Home
```

---

# 8. Onboarding

First-time users choose:

### Required

- Country
- Username
- Profile image
- Language
- Date of birth / age confirmation

### Optional

- Languages spoken
- Interests
- Favorite categories
- Short biography

Example:

```text
Country: Tunisia
Languages:
  Arabic
  French
  English

Interests:
  Food
  Music
  Travel
  Technology
  Football
```

---

# 9. Home Dashboard

The home screen should show:

```text
Hello, Nour

Level 7
████████░░ 720 / 1000 XP

Virtual Passport
12 / 195 countries unlocked

Daily Challenge
[ Play ]

People to Discover
[ User cards ]

Continue a Game
[ Game cards ]

Recent Achievements
[ Badge cards ]
```

Main CTA:

**Play a World Challenge**

---

# 10. Social Discovery

Users can discover other users.

Filters:

- Country
- Language
- Interests
- Online status
- Level
- Game preference

User card:

```text
[PHOTO]

Username
Country
Flag

Languages
Interests

Level 12
2450 XP

[View Profile]
[Challenge]
```

Do not expose sensitive personal information.

Never display:

- Exact home address
- Private email
- Phone number
- Private account data

---

# 11. User Profile

Profile fields:

```text
Profile picture
Username
Country
Flag
Bio
Languages
Interests
Level
XP
Games played
Games won
Countries unlocked
Badges
```

Example:

```text
Nour
Tunisia

Level 8
1,420 XP

Passport
14 countries

Games
42 played
27 won

Badges
World Explorer
Culture Master
Quiz Champion
```

---

# 12. Virtual Passport

This is the signature feature.

Every player has a virtual passport.

## 12.1 Passport concept

The passport contains all countries.

Default state:

```text
Tunisia        UNLOCKED
Canada         LOCKED
France         LOCKED
Japan          LOCKED
Brazil         LOCKED
Italy          LOCKED
...
```

A country becomes unlocked when:

> The player completes a qualifying game with a player associated with that country.

Example:

```text
Player A = Tunisia
Player B = Japan

They complete a game.

Player A:
Japan → unlocked

Player B:
Tunisia → unlocked
```

## 12.2 Passport country states

Each country can have:

```text
LOCKED
DISCOVERED
COMPLETED
MASTERED
```

Recommended meaning:

### LOCKED

No completed qualifying interaction.

### DISCOVERED

User has met a player from the country.

### COMPLETED

User has successfully completed a game with a player from that country.

### MASTERED

User has completed multiple different games/categories involving the country.

---

# 13. Passport UI

Display:

```text
MY PASSPORT

Countries discovered:
18 / 195

[World Map]

Unlocked:
🇹🇳 Tunisia
🇨🇦 Canada
🇫🇷 France
🇯🇵 Japan
🇧🇷 Brazil

Locked:
🇮🇹 Italy
🇩🇪 Germany
🇰🇷 South Korea
...
```

Clicking a country opens:

```text
Japan

Status: COMPLETED

First discovered:
September 28, 2026

Players met:
3

Games played:
5

Best score:
920

Badges:
Japan Explorer
```

---

# 14. Countries Database

The database should use ISO country codes.

Recommended fields:

```text
id
iso2
iso3
name
officialName
capital
continent
region
flagEmoji
flagUrl
latitude
longitude
population
languages
currency
timezone
description
createdAt
updatedAt
```

Example:

```json
{
  "iso2": "TN",
  "iso3": "TUN",
  "name": "Tunisia",
  "capital": "Tunis",
  "flagEmoji": "🇹🇳",
  "continent": "Africa"
}
```

Use a reliable public dataset for country metadata.

Do not hardcode country data throughout the application.

---

# 15. World Challenge Game System

The game system must be modular.

All games share a common interface.

```text
Game
 ├── Country Quiz
 ├── Guess the Word
 ├── Mystery Cuisine
 ├── Music Challenge
 ├── World Map
 ├── Mime
 └── 1v1 Duel
```

Each game has:

```text
Game definition
Game session
Players
Questions
Answers
Score
Timer
Results
Rewards
```

---

# 16. Game Categories

## 16.1 Country Quiz

User identifies a country based on:

- Flag
- Photo
- Capital
- Landmark
- Geography
- Cultural clue

Example:

```text
Which country does this flag belong to?

[ FLAG ]

A. Tunisia
B. Turkey
C. Japan
D. Morocco
```

---

# 17. Guess the Word

One user submits a word from their language.

The other user guesses its meaning.

Example:

```text
Language: Arabic

Word:
"مرحباً"

Choices:

Hello
Goodbye
Thank you
Friend
```

Better multiplayer mode:

```text
Player A:
Selects a word

Player B:
Types or chooses meaning

Player A:
Confirms correctness
```

The system should prevent offensive content through moderation/filtering.

---

# 18. Mystery Cuisine

Show:

- Food image
- Ingredients
- Description
- Optional clues

Question:

```text
Which country is this dish associated with?

A. Tunisia
B. Mexico
C. Japan
D. Greece
```

Country attribution should be stored in the database.

Avoid presenting culturally disputed origins as absolute facts. Store descriptions as neutral educational content.

---

# 19. Music Challenge

Possible modes:

### Mode A

Identify country/language from a short licensed audio clip.

### Mode B

Identify language from metadata or lyrics excerpt.

### Mode C

Identify genre/instrument.

For MVP, avoid uploading copyrighted music without permission.

Use:

- Public-domain audio
- Creative Commons material with compatible licenses
- Original audio
- Short metadata-based questions

Database:

```text
title
language
country
artist
genre
audioUrl
license
source
```

---

# 20. World Map Challenge

Show an interactive world map.

Prompt:

```text
Find Japan
```

User clicks the map.

Calculate distance between:

```text
correct country coordinates
clicked coordinates
```

Scoring can depend on:

```text
distance
response time
difficulty
```

Example:

```text
< 100 km      = 100 points
100-500 km    = 80 points
500-1500 km   = 60 points
1500-3000 km  = 40 points
> 3000 km     = 10 points
```

These values must be configurable.

---

# 21. Mime

Player receives a culture-related concept.

Example:

```text
Act this:

"Traditional Tunisian wedding"
```

For MVP:

- Player chooses concept
- Other player selects guessed answer
- No video required

Future:

- Video mime mode

---

# 22. 1v1 Duel

Two players receive the same questions.

Example:

```text
ROUND 1

Question:
Which country has Tokyo as its capital?

Player A:
Japan

Player B:
China

Player A +100

ROUND 2
...
```

At the end:

```text
Player A: 820
Player B: 670

Winner: Player A
```

Avoid giving extra reward solely for defeating another user in a way that creates abusive competitive incentives. Rewards should primarily reflect participation and correct answers.

---

# 23. Game Modes

Each game supports:

### SOLO

Player plays against the system.

### FRIEND

Invite another player.

### RANDOM

Match with a compatible available player.

### DUEL

Competitive synchronized mode.

---

# 24. Game Session State Machine

Every multiplayer game must have a state.

```text
WAITING
   ↓
READY
   ↓
COUNTDOWN
   ↓
PLAYING
   ↓
ROUND_COMPLETE
   ↓
NEXT_ROUND
   ↓
FINISHED
   ↓
RESULTS
```

Possible cancellation:

```text
WAITING → CANCELLED
PLAYING → ABANDONED
```

Server is authoritative.

The client must NEVER decide final scores.

---

# 25. Real-Time Architecture

Use Socket.IO.

Connection:

```text
Client
   |
   | WebSocket
   ↓
Socket.IO Gateway
   |
   ↓
Game Session Service
   |
   ↓
PostgreSQL
```

---

# 26. WebSocket Events

## Client → Server

```text
game:create
game:join
game:ready
game:start
game:answer
game:next
game:leave
game:rematch
```

## Server → Client

```text
game:created
game:joined
game:player_joined
game:player_ready
game:started
game:question
game:answer_result
game:round_complete
game:next_round
game:finished
game:results
game:error
```

---

# 27. Server Authority

The backend controls:

- Question selection
- Correct answer
- Timer
- Score
- Round progression
- Winner
- Rewards
- Passport unlock
- XP

The frontend only displays state and sends user actions.

Never send the correct answer to the browser before the player answers.

---

# 28. Anti-Cheat

Implement:

1. Server-side scoring.
2. Server-side timers.
3. Question randomization.
4. Unique question IDs per session.
5. Rate limiting.
6. Answer submission validation.
7. Reject answers after round timeout.
8. Prevent duplicate answer submissions.
9. Record timestamps.
10. Validate game membership on every event.

---

# 29. Scoring System

Every game returns:

```text
basePoints
speedBonus
accuracyBonus
participationPoints
```

Example:

```text
Correct answer = 100
Fast answer bonus = 0-50
Difficulty multiplier = 1.0-2.0
```

The exact formula must be centralized.

Example:

```ts
score =
  basePoints
  + speedBonus
  + difficultyBonus;
```

Do not implement score calculations independently inside every frontend component.

Create:

```text
ScoringService
```

---

# 30. XP System

Players earn XP for:

- Completing games
- Correct answers
- Discovering countries
- Completing challenges
- Winning/participating in duels
- Earning badges

Example:

```text
Complete game: +50 XP
Correct answer: +10 XP
Discover country: +100 XP
First game with a country: +50 XP
Badge: +100 XP
```

All values should be configurable.

---

# 31. Level System

Recommended formula:

```text
XP required for level N =
100 × N²
```

Example:

```text
Level 1 = 100 XP
Level 2 = 400 XP
Level 3 = 900 XP
Level 4 = 1600 XP
...
```

Store total XP in the user profile.

Calculate level server-side.

---

# 32. Badges

Example badges:

### World Explorer

Unlock 10 countries.

### Global Citizen

Unlock 25 countries.

### Culture Master

Complete 50 culture games.

### Quiz Champion

Get 10 perfect quiz results.

### Language Explorer

Play word games in 5 languages.

### Food Explorer

Complete cuisine challenges from 10 countries.

### Duelist

Complete 25 1v1 games.

Badge model:

```text
id
name
description
icon
criteriaType
criteriaValue
createdAt
```

Achievement unlocking should be handled by:

```text
AchievementService
```

---

# 33. Leaderboards

Possible leaderboards:

- Global XP
- Weekly XP
- Countries discovered
- Games completed
- Quiz score

For privacy, allow users to hide their public leaderboard profile.

---

# 34. Chat System

Basic messaging is required.

Conversation types:

```text
DIRECT
GAME_ROOM
```

Message fields:

```text
id
conversationId
senderId
content
createdAt
readAt
deletedAt
```

Features:

- Send message
- Receive message
- Read status
- Delete own message
- Block user
- Report message

---

# 35. Chat Safety

Implement:

- Block
- Report
- Message deletion
- Rate limits
- Basic profanity filtering
- Admin moderation
- Account suspension

Do not automatically assume every filtered word is abusive. Moderation should support review.

---

# 36. Notifications

Notification types:

```text
GAME_INVITE
GAME_STARTED
GAME_RESULT
NEW_MESSAGE
BADGE_UNLOCKED
COUNTRY_UNLOCKED
LEVEL_UP
SYSTEM
```

Notification fields:

```text
id
userId
type
title
body
data
read
createdAt
```

---

# 37. Database Design

Use PostgreSQL + Prisma.

Core entities:

```text
User
Country
UserCountry
Game
GameSession
GamePlayer
Question
GameAnswer
Conversation
ConversationMember
Message
Badge
UserBadge
Notification
Report
Block
RefreshToken
```

---

# 38. User Table

Conceptual schema:

```prisma
model User {
  id              String   @id @default(cuid())
  username        String   @unique
  email           String   @unique
  passwordHash    String
  avatarUrl       String?
  bio             String?
  countryId       String
  language        String?
  xp              Int      @default(0)
  level           Int      @default(1)
  isOnline        Boolean  @default(false)
  isAdmin         Boolean  @default(false)
  isSuspended     Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  country         Country  @relation(fields: [countryId], references: [id])
}
```

Add proper indexes and relations when implementing.

---

# 39. Country Table

```prisma
model Country {
  id            String   @id @default(cuid())
  iso2          String   @unique
  iso3          String   @unique
  name          String
  officialName  String?
  capital       String?
  continent     String?
  region        String?
  flagEmoji     String?
  flagUrl       String?
  latitude      Float?
  longitude     Float?
  description   String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

# 40. UserCountry Table

This represents passport progress.

```prisma
model UserCountry {
  id             String   @id @default(cuid())
  userId         String
  countryId      String
  status         String
  discoveredAt   DateTime?
  completedAt    DateTime?
  gamesPlayed    Int      @default(0)
  bestScore      Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user            User     @relation(fields: [userId], references: [id])
  country         Country  @relation(fields: [countryId], references: [id])

  @@unique([userId, countryId])
}
```

---

# 41. Game Table

```prisma
model Game {
  id          String   @id @default(cuid())
  type        String
  name        String
  description String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}
```

Game types:

```text
COUNTRY_QUIZ
GUESS_WORD
MYSTERY_CUISINE
MUSIC
WORLD_MAP
MIME
DUEL
```

---

# 42. GameSession

```prisma
model GameSession {
  id          String   @id @default(cuid())
  gameId      String
  status      String
  mode        String
  maxPlayers  Int
  currentRound Int     @default(0)
  startedAt   DateTime?
  finishedAt  DateTime?
  createdAt   DateTime @default(now())
}
```

---

# 43. GamePlayer

```prisma
model GamePlayer {
  id          String   @id @default(cuid())
  sessionId   String
  userId      String
  score       Int      @default(0)
  ready       Boolean  @default(false)
  joinedAt    DateTime @default(now())
  finishedAt  DateTime?

  @@unique([sessionId, userId])
}
```

---

# 44. Question

```prisma
model Question {
  id            String   @id @default(cuid())
  gameType      String
  countryId     String?
  language      String?
  prompt        String
  imageUrl      String?
  audioUrl      String?
  options       Json?
  correctAnswer String
  difficulty    Int      @default(1)
  explanation   String?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

For production, consider storing sensitive answer data separately if necessary.

---

# 45. GameAnswer

```prisma
model GameAnswer {
  id           String   @id @default(cuid())
  sessionId    String
  playerId     String
  questionId   String
  answer       String
  isCorrect    Boolean
  points       Int
  responseMs   Int?
  createdAt    DateTime @default(now())
}
```

---

# 46. Conversation

```prisma
model Conversation {
  id        String   @id @default(cuid())
  type      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

# 47. Message

```prisma
model Message {
  id             String   @id @default(cuid())
  conversationId String
  senderId       String
  content        String
  createdAt      DateTime @default(now())
  readAt         DateTime?
  deletedAt      DateTime?
}
```

---

# 48. Badge

```prisma
model Badge {
  id            String   @id @default(cuid())
  name          String
  description   String
  iconUrl       String?
  criteriaType  String
  criteriaValue Int
}
```

---

# 49. Report

```prisma
model Report {
  id            String   @id @default(cuid())
  reporterId    String
  reportedUserId String?
  messageId     String?
  reason        String
  description   String?
  status        String   @default("PENDING")
  createdAt     DateTime @default(now())
  reviewedAt    DateTime?
}
```

---

# 50. Block

```prisma
model Block {
  id        String   @id @default(cuid())
  blockerId String
  blockedId String
  createdAt DateTime @default(now())

  @@unique([blockerId, blockedId])
}
```

---

# 51. Authentication Architecture

Use:

```text
Access token
+
Refresh token
```

Recommended:

- Access token: short-lived
- Refresh token: longer-lived
- Store refresh tokens securely
- Rotate refresh tokens
- Revoke on logout

Password:

```text
Argon2id
```

Never store plain-text passwords.

---

# 52. REST API

Base URL:

```text
/api/v1
```

## Auth

```text
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me
```

## Users

```text
GET    /users/me
PATCH  /users/me
GET    /users/:id
GET    /users
POST   /users/:id/block
DELETE /users/:id/block
POST   /users/:id/report
```

## Countries

```text
GET /countries
GET /countries/:id
GET /countries/:id/players
GET /users/me/passport
GET /users/me/passport/:countryId
```

## Games

```text
GET  /games
GET  /games/:type
POST /games/sessions
GET  /games/sessions/:id
POST /games/sessions/:id/join
POST /games/sessions/:id/leave
GET  /games/sessions/:id/results
```

## Questions

Admin only:

```text
GET    /admin/questions
POST   /admin/questions
PATCH  /admin/questions/:id
DELETE /admin/questions/:id
```

## Badges

```text
GET /badges
GET /users/me/badges
```

## Leaderboard

```text
GET /leaderboard/global
GET /leaderboard/weekly
GET /leaderboard/countries
```

## Notifications

```text
GET   /notifications
PATCH /notifications/:id/read
PATCH /notifications/read-all
```

---

# 53. API Response Standard

Success:

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": []
  }
}
```

Use consistent HTTP status codes.

---

# 54. Frontend Architecture

Recommended structure:

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   └── store/
│
├── assets/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── game/
│   ├── passport/
│   ├── profile/
│   └── chat/
│
├── features/
│   ├── auth/
│   ├── users/
│   ├── games/
│   ├── passport/
│   ├── chat/
│   ├── notifications/
│   └── leaderboard/
│
├── pages/
│   ├── Home/
│   ├── Discover/
│   ├── Passport/
│   ├── Games/
│   ├── Chat/
│   ├── Profile/
│   ├── Leaderboard/
│   └── Settings/
│
├── services/
│   ├── api.ts
│   ├── auth.ts
│   └── socket.ts
│
├── hooks/
├── types/
├── utils/
└── main.tsx
```

---

# 55. Backend Architecture

```text
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── guards/
│   │   └── dto/
│   │
│   ├── users/
│   ├── countries/
│   ├── passport/
│   ├── games/
│   │   ├── games.module.ts
│   │   ├── games.controller.ts
│   │   ├── games.service.ts
│   │   ├── game.gateway.ts
│   │   ├── engine/
│   │   ├── scoring/
│   │   └── modes/
│   │
│   ├── chat/
│   ├── badges/
│   ├── leaderboard/
│   ├── notifications/
│   ├── moderation/
│   └── common/
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
└── test/
```

---

# 56. Game Engine Architecture

Use a common interface.

```ts
interface GameEngine {
  getGameType(): GameType;

  createSession(
    config: CreateGameConfig
  ): Promise<GameSession>;

  startSession(
    sessionId: string
  ): Promise<void>;

  submitAnswer(
    sessionId: string,
    playerId: string,
    answer: unknown
  ): Promise<AnswerResult>;

  finishSession(
    sessionId: string
  ): Promise<GameResult>;
}
```

Implement:

```text
CountryQuizEngine
GuessWordEngine
CuisineEngine
MusicEngine
WorldMapEngine
MimeEngine
DuelEngine
```

---

# 57. Game Factory

Use a factory:

```ts
GameEngineFactory.getEngine(gameType)
```

Example:

```ts
const engine =
  gameEngineFactory.getEngine("COUNTRY_QUIZ");

await engine.submitAnswer(
  sessionId,
  playerId,
  answer
);
```

This makes adding new games easier.

---

# 58. Game Session Security

Every socket request must validate:

```text
JWT
+
socket user ID
+
session membership
+
session status
+
allowed action
```

Example:

```text
Player A cannot submit an answer
for Player B.
```

---

# 59. Matchmaking

MVP:

```text
Player selects country/game
↓
Create game
↓
Share invitation
↓
Other player joins
```

Phase 2:

```text
Random Matchmaking Queue

Filters:
- Game type
- Language
- Level range
- Country
```

Queue table:

```text
MatchmakingEntry
```

Fields:

```text
id
userId
gameType
language
countryId
status
createdAt
```

---

# 60. Passport Unlock Algorithm

When a qualifying game ends:

```text
winner/participants
       ↓
Get each player's country
       ↓
For every participant:
    Get opponent country
       ↓
Create/update UserCountry
       ↓
Set status = COMPLETED
       ↓
Award XP
       ↓
Check badges
       ↓
Create notification
```

Important:

A user should not need to win to unlock a country. The passport represents cultural interaction, not only victory.

---

# 61. Transactional Reward Processing

Rewards must be processed in one database transaction.

Pseudo-flow:

```ts
await prisma.$transaction(async tx => {

  await updateGameResult(tx);

  await addXp(tx);

  await unlockPassportCountry(tx);

  await checkAchievements(tx);

  await createNotifications(tx);

});
```

This prevents partial reward states.

---

# 62. Idempotency

Reward processing must be idempotent.

If the same game result is accidentally processed twice:

```text
XP must not be duplicated.
Passport must not be duplicated.
Badge must not be duplicated.
```

Store:

```text
rewardProcessedAt
```

or use unique constraints/events.

---

# 63. Admin Dashboard

Admin pages:

```text
Dashboard
Users
Countries
Questions
Games
Badges
Reports
Moderation
Statistics
```

Dashboard statistics:

```text
Total users
Active users
Games today
Games completed
Countries discovered
Messages
Reports
```

---

# 64. Admin Question Manager

Admin can:

```text
Create question
Edit question
Delete question
Activate/deactivate question
Assign country
Assign difficulty
Assign category
Upload image
```

Question editor:

```text
Game type
Question
Options
Correct answer
Country
Difficulty
Explanation
Media
```

---

# 65. Content Seeding

Seed:

- Countries
- Game types
- Initial questions
- Badges
- Demo users
- Demo games

Commands:

```bash
npx prisma migrate dev
npx prisma db seed
```

---

# 66. Environment Variables

Backend:

```env
NODE_ENV=development

PORT=5000

DATABASE_URL=postgresql://...

JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...

FRONTEND_URL=http://localhost:5180

REDIS_URL=redis://localhost:6379

STORAGE_ENDPOINT=...
STORAGE_BUCKET=...
STORAGE_ACCESS_KEY=...
STORAGE_SECRET_KEY=...
```

Frontend:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

Never commit secrets.

Create:

```text
.env.example
```

---

# 67. Local Development

Required software:

```text
Node.js 20+
npm
PostgreSQL
Git
```

Optional:

```text
Docker
Redis
```

Recommended Docker services:

```yaml
services:
  postgres:
  redis:
```

---

# 68. Docker Development

Create:

```text
docker-compose.yml
```

Services:

```text
postgres
redis
backend
frontend
```

For the first MVP, PostgreSQL + backend + frontend is enough. Redis can be enabled when real-time scaling is needed.

---

# 69. Security Requirements

Implement:

- Helmet
- CORS
- Rate limiting
- Request validation
- JWT validation
- Password hashing
- Input sanitization
- SQL injection protection through Prisma
- XSS-safe rendering
- CSRF strategy where applicable
- Secure cookies if refresh tokens use cookies
- File upload validation
- Maximum upload sizes
- Role-based authorization
- Audit logging for admin actions

---

# 70. Rate Limits

Examples:

```text
Login:
5 failed attempts / minute / IP

Register:
5 requests / hour / IP

Messages:
30 messages / minute / user

Game answer:
1 answer / question / player

Report:
10 reports / hour / user
```

These values are configurable.

---

# 71. Privacy

Store only required information.

User should be able to:

```text
Edit profile
Hide profile
Block users
Delete account
Request data deletion
```

Account deletion should remove or anonymize personal data according to the application's retention policy.

---

# 72. Age and Safety

Because this is a social application, include age and safety controls.

For an MVP aimed at adults:

```text
18+ confirmation
```

If the application will support minors, create a separate safety design with age-appropriate interaction, stricter discovery controls, reporting, and parental/legal requirements.

Do not allow public display of sensitive personal data.

---

# 73. Accessibility

The UI must support:

- Keyboard navigation
- Screen readers
- Visible focus states
- Sufficient color contrast
- Labels for inputs
- Alt text
- Non-color-only status indicators
- Reduced-motion preference

Do not make flags the only indication of a country.

---

# 74. Responsive Design

Desktop:

```text
Sidebar
Main content
Right activity panel
```

Mobile:

```text
Top bar
Main content
Bottom navigation
```

Bottom navigation:

```text
Home
Discover
Games
Passport
Profile
```

---

# 75. Visual Design

Recommended visual direction:

```text
Modern
Clean
Travel-inspired
Social
Playful
International
```

Suggested visual elements:

- Passport cards
- Country stamps
- Map backgrounds
- Flag chips
- Achievement cards
- Progress bars
- Game cards
- Rounded UI
- Subtle animations

Do not make the UI overly childish.

---

# 76. Passport Animation

When unlocking a country:

```text
Game complete
↓
Passport opens
↓
Country stamp animation
↓
Country marked discovered
↓
XP animation
↓
Badge check
↓
Notification
```

Keep animation short and accessible.

---

# 77. Error Handling

Frontend should display human-readable errors.

Examples:

```text
Unable to join the game.
The game is already full.

Connection lost.
Reconnecting...

This game has ended.

You have already submitted an answer.
```

Backend errors should contain machine-readable codes.

---

# 78. Offline / Reconnection

For game sessions:

```text
Socket disconnects
↓
Client reconnects
↓
Authenticate socket
↓
Rejoin session
↓
Fetch current server state
↓
Resume UI
```

Do not trust client-side cached game state as authoritative.

---

# 79. Testing Strategy

## Unit tests

Test:

- Scoring
- XP
- Levels
- Passport unlock
- Badge criteria
- Country map distance
- Validation
- Authentication utilities

## Integration tests

Test:

- Register
- Login
- Create game
- Join game
- Submit answer
- Finish game
- Rewards
- Passport

## E2E tests

Use Playwright.

Test:

```text
Register
→ Login
→ Discover user
→ Start game
→ Join with second user
→ Play
→ Finish
→ Verify passport
→ Verify XP
```

---

# 80. Example Scoring Unit Test

```ts
describe("ScoringService", () => {
  it("awards points for a correct answer", () => {
    const result = scoring.calculate({
      correct: true,
      responseMs: 1200,
      difficulty: 1
    });

    expect(result.points).toBeGreaterThan(0);
  });
});
```

---

# 81. API Documentation

Use Swagger/OpenAPI.

NestJS:

```text
/swagger
```

Document:

- Request body
- Responses
- Authentication
- Errors
- Examples

---

# 82. Logging

Use structured logs.

Log:

```text
request ID
user ID
route
status
duration
error code
```

Do NOT log:

- Passwords
- JWT secrets
- Private messages unnecessarily
- Sensitive personal information

---

# 83. Monitoring

Production:

```text
Application logs
Error monitoring
Database monitoring
API latency
WebSocket connections
Game completion rate
```

Optional:

- Prometheus
- Grafana
- Sentry

---

# 84. Project Folder Structure

Final repository:

```text
world-challenge/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── test/
│   └── package.json
│
├── shared/
│   ├── types/
│   └── constants/
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   └── games.md
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# 85. Shared Types

Create shared enums:

```ts
enum GameType {
  COUNTRY_QUIZ = "COUNTRY_QUIZ",
  GUESS_WORD = "GUESS_WORD",
  MYSTERY_CUISINE = "MYSTERY_CUISINE",
  MUSIC = "MUSIC",
  WORLD_MAP = "WORLD_MAP",
  MIME = "MIME",
  DUEL = "DUEL"
}
```

Also:

```ts
enum GameStatus {
  WAITING = "WAITING",
  READY = "READY",
  PLAYING = "PLAYING",
  FINISHED = "FINISHED",
  CANCELLED = "CANCELLED"
}

enum PassportStatus {
  LOCKED = "LOCKED",
  DISCOVERED = "DISCOVERED",
  COMPLETED = "COMPLETED",
  MASTERED = "MASTERED"
}
```

---

# 86. Recommended MVP Scope

The first working version must contain:

### Authentication

- Register
- Login
- Logout
- Profile

### Social

- Discover users
- View profile
- Direct chat
- Block/report

### Games

Implement first:

1. Country Quiz
2. Guess the Word
3. World Map
4. 1v1 Duel

Add Cuisine, Music and Mime after the core engine works.

### Progression

- XP
- Level
- Passport
- Countries
- Badges

### Admin

- Questions
- Countries
- Users
- Reports

---

# 87. Development Phases

## Phase 1 — Foundation

- Repository
- Frontend
- Backend
- PostgreSQL
- Prisma
- Environment configuration
- Docker
- CI basics

## Phase 2 — Authentication

- Registration
- Login
- JWT
- Refresh tokens
- Profile

## Phase 3 — Countries + Passport

- Country database
- Country pages
- Passport
- Unlock system

## Phase 4 — Game Engine

- Game interface
- Game sessions
- Questions
- Scoring
- XP

## Phase 5 — Multiplayer

- Socket.IO
- Rooms
- Ready state
- Real-time questions
- Real-time answers
- Results

## Phase 6 — Social

- Discover
- Profiles
- Chat
- Block
- Report

## Phase 7 — Gamification

- Badges
- Levels
- Leaderboards
- Notifications

## Phase 8 — Admin

- Dashboard
- Questions
- Countries
- Reports
- Users

## Phase 9 — Polish

- Animations
- Responsive design
- Accessibility
- Error states
- Loading states

## Phase 10 — Testing + Deployment

- Unit tests
- Integration tests
- E2E
- Docker
- Production deployment
- Documentation

---

# 88. Cursor Implementation Strategy

Cursor must NOT attempt to generate the entire application in one giant step.

Use controlled implementation phases.

### Rule 1

Before coding, inspect the repository.

### Rule 2

Create a plan and folder structure.

### Rule 3

Implement backend and frontend incrementally.

### Rule 4

After every phase:

```text
install dependencies
run typecheck
run lint
run tests
start application
verify manually
```

### Rule 5

Never silently change architecture.

### Rule 6

Never remove working functionality without explicit reason.

### Rule 7

Do not use fake APIs in production code.

### Rule 8

Use seed data for development.

### Rule 9

Never hardcode passwords or secrets.

### Rule 10

Keep business logic on the server.

---

# 89. Cursor Master Prompt

Paste the following into Cursor Agent:

```text
You are the lead full-stack engineer responsible for building the World Challenge application.

Read docs/technical-spec.md completely before coding.

Do not implement everything at once.

First inspect the repository and report:
1. Existing files
2. Existing framework
3. Existing dependencies
4. Existing database setup
5. Existing routes
6. Existing components
7. Potential conflicts

Then create an implementation plan.

Technology requirements:
- Frontend: React + TypeScript + Vite
- Backend: NestJS + TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Real-time: Socket.IO
- State: Zustand or an equivalent lightweight state manager
- Data fetching: TanStack Query
- Validation: Zod on frontend and DTO validation on backend
- Authentication: JWT + refresh tokens
- Password hashing: Argon2
- Testing: Vitest/Jest + Playwright
- API documentation: Swagger/OpenAPI

Architecture requirements:
- Modular backend
- Feature-based frontend
- Server-authoritative multiplayer
- Centralized scoring service
- Game engine abstraction
- Transactional reward processing
- Passport unlock service
- Achievement service
- Consistent API response format
- Strong validation
- Role-based authorization
- Rate limiting
- Secure authentication

Core features:
1. Authentication
2. Profiles
3. Countries
4. Virtual Passport
5. Discover users
6. Chat
7. Country Quiz
8. Guess the Word
9. Mystery Cuisine
10. Music Challenge
11. World Map
12. Mime
13. 1v1 Duel
14. XP
15. Levels
16. Badges
17. Leaderboards
18. Notifications
19. Reports
20. Blocking
21. Admin dashboard

Game requirements:
- Game sessions are server authoritative.
- Never trust client score.
- Never expose correct answers before submission.
- Validate every socket event.
- Prevent duplicate answers.
- Handle disconnect/reconnect.
- Use a common GameEngine interface.
- Add games through the factory pattern.
- Process rewards in a database transaction.
- Make reward processing idempotent.

Passport requirements:
- Each user has a virtual passport.
- Countries are stored in the database.
- When a user completes a qualifying game with another country's player, unlock that country.
- Unlocking does not require winning.
- Record discovery date, games played and best score.
- Award XP only once for first discovery.

Security:
- Never store plain-text passwords.
- Use Argon2.
- Validate all input.
- Use Helmet.
- Configure CORS.
- Add rate limiting.
- Protect admin routes.
- Validate uploads.
- Do not expose private user data.
- Do not put secrets in source code.

Quality:
- TypeScript strict mode.
- No any unless absolutely necessary.
- Reusable components.
- Clean error handling.
- Loading and empty states.
- Accessible UI.
- Responsive layout.
- Unit tests for business logic.
- Integration tests for critical APIs.
- E2E test for complete user flow.

Development order:

PHASE 1:
Repository + frontend + backend + PostgreSQL + Prisma + Docker.

PHASE 2:
Authentication + users + profile.

PHASE 3:
Countries + passport.

PHASE 4:
Game engine + country quiz.

PHASE 5:
Socket.IO + multiplayer + duel.

PHASE 6:
Guess the Word + World Map.

PHASE 7:
Cuisine + Music + Mime.

PHASE 8:
Chat + Discover + moderation.

PHASE 9:
XP + badges + leaderboards + notifications.

PHASE 10:
Admin dashboard + testing + deployment.

After each phase:
- Run typecheck.
- Run lint.
- Run tests.
- Fix errors.
- Update documentation.
- Show changed files.
- Explain how to run the new functionality.

Do not proceed to the next major phase until the current phase is working.

Start by inspecting the repository and implementing PHASE 1.
```

---

# 90. Cursor Phase Prompts

## Phase 1

```text
Implement PHASE 1 only.

Create:
- frontend
- backend
- PostgreSQL configuration
- Prisma
- Docker Compose
- environment files
- shared types
- README

Verify:
npm install
npm run build
npm run typecheck
npm test

Do not implement authentication or games yet.
```

## Phase 2

```text
Implement PHASE 2.

Create:
- User model
- authentication
- registration
- login
- refresh token
- logout
- current-user endpoint
- profile page
- protected routes
- JWT guards

Add tests.

Do not implement games yet.
```

## Phase 3

```text
Implement PHASE 3.

Create:
- Country model
- country seed data
- country API
- passport API
- passport UI
- country detail page
- UserCountry relation
- passport unlock service

Add tests for country unlocking.

Do not implement multiplayer yet.
```

## Phase 4

```text
Implement PHASE 4.

Create:
- Game model
- Question model
- GameSession
- GamePlayer
- GameAnswer
- GameEngine interface
- GameEngineFactory
- CountryQuizEngine
- ScoringService
- XP service

Implement Country Quiz in SOLO mode first.

Server must be authoritative.
```

## Phase 5

```text
Implement PHASE 5.

Add:
- Socket.IO
- game rooms
- player joining
- ready state
- countdown
- synchronized rounds
- server-side timers
- answer events
- results
- reconnect handling

Then implement 1v1 Duel.

Write integration tests for two players.
```

---

# 91. Definition of Done

A feature is complete only if:

```text
[ ] Backend implemented
[ ] Frontend implemented
[ ] Database migration created
[ ] Validation implemented
[ ] Authorization implemented
[ ] Error handling implemented
[ ] Loading state implemented
[ ] Empty state implemented
[ ] Tests added
[ ] Typecheck passes
[ ] Lint passes
[ ] Build passes
[ ] Documentation updated
```

---

# 92. Critical Business Rules

1. Users cannot unlock their own country through the passport interaction.
2. A country unlock must be associated with an actual completed qualifying game.
3. A game result can only be finalized once.
4. XP rewards must be idempotent.
5. Scores are calculated server-side.
6. Correct answers must not be exposed before submission.
7. Blocked users cannot send direct messages to each other.
8. Suspended users cannot start or join games.
9. Admin routes require admin authorization.
10. Deleted users must not remain discoverable.
11. Reports cannot be submitted infinitely by one user.
12. A player can only answer questions belonging to their active session.
13. A player cannot submit multiple answers to the same question.
14. Game timers are controlled by the server.
15. Passport status is derived from verified game interactions.

---

# 93. Example End-to-End Scenario

## Player A

```text
Username: Nour
Country: Tunisia
```

## Player B

```text
Username: Alex
Country: Japan
```

Nour discovers Alex.

Nour creates:

```text
Game:
Country Quiz
Mode:
1v1
```

Alex joins.

Server:

```text
Creates session
Adds both players
Starts countdown
```

Question:

```text
Which country has Tokyo as its capital?
```

Nour answers:

```text
Japan
```

Alex answers:

```text
China
```

Server calculates:

```text
Nour +100
Alex +0
```

After all rounds:

```text
Nour: 820
Alex: 620
```

Game finishes.

Reward transaction:

```text
Nour + XP
Alex + XP

Nour passport:
Japan = COMPLETED

Alex passport:
Tunisia = COMPLETED
```

Achievement service checks:

```text
Did Nour unlock 10 countries?
Did Alex unlock 10 countries?
```

Notification:

```text
You discovered Japan.
```

---

# 94. Future Features

Possible future releases:

### Version 2

- Random matchmaking
- Friends
- Friend requests
- Voice chat
- Video mime
- More advanced map games
- Daily missions

### Version 3

- AI-generated question suggestions
- Personalized game recommendations
- Cultural learning paths
- Country collections
- Events
- Tournaments

### Version 4

- Native mobile applications
- Push notifications
- Advanced moderation
- Real-time translation
- AR passport

AI must never silently generate factual cultural content without validation. Human/admin review should be available for published educational content.

---

# 95. Recommended Technical Decisions

| Area | Decision |
|---|---|
| Frontend | React + TypeScript + Vite |
| Backend | NestJS |
| Database | PostgreSQL |
| ORM | Prisma |
| Real-time | Socket.IO |
| State | Zustand |
| Server data | TanStack Query |
| Validation | Zod + NestJS validation |
| Auth | JWT + refresh token |
| Password | Argon2id |
| Map | Leaflet/MapLibre |
| Testing | Vitest/Jest + Playwright |
| API docs | Swagger |
| Containers | Docker |
| Cache | Redis when required |
| Storage | S3-compatible storage |
| Deployment | Vercel + Render/Railway/VPS |

---

# 96. Final Architecture Principle

The most important design principle is:

```text
SOCIAL INTERACTION
        +
CULTURAL GAMES
        +
REAL-TIME MULTIPLAYER
        +
VIRTUAL PASSPORT
        +
GAMIFICATION
```

The application should not feel like:

```text
Chat app + random quizzes
```

It should feel like:

```text
A social world-exploration game
where every person you meet
can help you discover a new country.
```

The Virtual Passport is the central progression mechanism connecting:

```text
People
   ↓
Games
   ↓
Countries
   ↓
XP
   ↓
Badges
   ↓
Progress
```

---

# 97. First Implementation Target

The first usable prototype should achieve exactly this:

```text
Register
   ↓
Choose country
   ↓
Login
   ↓
Home
   ↓
Open Discover
   ↓
See another player
   ↓
Challenge player
   ↓
Create 1v1 Country Quiz
   ↓
Second player joins
   ↓
Both answer synchronized questions
   ↓
Server calculates scores
   ↓
Game ends
   ↓
Results displayed
   ↓
XP awarded
   ↓
Opponent country unlocked
   ↓
Passport updated
```

Once this vertical slice works end-to-end, expand the same architecture to the other game types.

---

# 98. Success Criteria for the MVP

The MVP is considered technically successful when two separate browser sessions can:

1. Create two accounts.
2. Select different countries.
3. Discover each other.
4. Create a game.
5. Join the same game.
6. Receive synchronized questions.
7. Submit answers.
8. Receive server-calculated scores.
9. Finish the game.
10. Receive XP.
11. Unlock the opponent's country.
12. See the unlocked country in the passport.
13. Receive an achievement/notification when applicable.
14. Continue to chat.
15. Block/report another account.
16. Recover from a temporary WebSocket disconnect.
17. Have all important data persist after page refresh.

That vertical slice is the foundation of the complete World Challenge product.
