# Games

The game engine is not implemented in Phase 1.

Planned types (from the technical spec):

1. Country Quiz
2. Guess the Word
3. Mystery Cuisine
4. Music Challenge
5. World Map
6. Mime
7. 1v1 Duel

MVP order after the foundation is stable:

1. Country Quiz (solo, then multiplayer)
2. Guess the Word
3. World Map
4. 1v1 Duel

All games will share a `GameEngine` interface and a factory. The server remains authoritative for questions, timers, scores, rewards, and passport unlocks.
