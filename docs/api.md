# API

Base URL: `/api/v1`

Interactive docs: [http://localhost:5000/swagger](http://localhost:5000/swagger)

## Response envelope

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

## Public

- `GET /health`
- `GET /countries`
- `GET /countries/:id`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh` (httpOnly `wc_refresh` cookie)
- `POST /auth/logout`

## Authenticated

- `GET /auth/me`
- `GET /users/me`
- `PATCH /users/me`
- `GET /users`
- `GET /users/:id`
- `GET /users/me/passport`
- `GET /games`
- `POST /games/sessions`
- `GET /games/sessions/mine`
- `GET /games/sessions/:id`
- `POST /games/sessions/:id/join`
- `GET /games/sessions/:id/results`

## Sockets

Client → server: `game:join`, `game:ready`, `game:answer`, `game:leave`

Server → client: `game:joined`, `game:player_joined`, `game:player_ready`, `game:started`, `game:question`, `game:answer_result`, `game:round_complete`, `game:next_round`, `game:finished`, `game:results`, `game:error`

Correct answers are not sent until the round is complete. Scores, timers, XP, and passport unlocks are server-side.
