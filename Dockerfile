# ================================
# Build stage
# ================================

FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
COPY src ./src
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN DATABASE_URL="postgresql://user:password@localhost:5432/orderflow" \
    DIRECT_URL="postgresql://user:password@localhost:5432/orderflow" \
    npx prisma generate

RUN npm run build


# ================================
# Production stage
# ================================

FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma

EXPOSE 3000

CMD ["node", "dist/src/main.js"]