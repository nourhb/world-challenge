FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/
RUN npm ci

FROM deps AS build
COPY shared ./shared
COPY backend ./backend
RUN npm run build -w @world-challenge/shared && npm run build -w backend

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/shared ./shared
COPY --from=build /app/backend ./backend
WORKDIR /app/backend
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
