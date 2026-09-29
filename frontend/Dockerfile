FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY shared/package.json ./shared/
COPY frontend/package.json ./frontend/
RUN npm ci
COPY shared ./shared
COPY frontend ./frontend
WORKDIR /app/frontend
EXPOSE 5180
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
