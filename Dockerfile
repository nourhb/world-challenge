FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN npm ci

FROM deps AS build
COPY shared ./shared
COPY backend ./backend
COPY frontend ./frontend
ENV VITE_API_URL=/api/v1
ENV VITE_SOCKET_URL=
RUN npm run build -w @world-challenge/shared \
  && npm run build -w frontend \
  && npm run build -w backend

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/shared ./shared
COPY --from=build /app/backend ./backend
COPY --from=build /app/frontend/dist ./frontend/dist
WORKDIR /app/backend
ENV CLIENT_DIR=/app/frontend/dist
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/main.js"]
