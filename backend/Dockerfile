# Doorstep backend — container image
FROM node:20-slim

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# App source
COPY . .

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

# Runs the TypeScript entry directly via tsx (a dependency).
CMD ["npx", "tsx", "src/index.ts"]
