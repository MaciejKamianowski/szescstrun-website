# syntax=docker/dockerfile:1

FROM node:22.23.5-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
# Pin pnpm via packageManager (pnpm@10.34.9). Without this, Corepack may fetch an incompatible latest (e.g. 12.x).
RUN corepack enable && corepack prepare pnpm@10.34.9 --activate \
  && pnpm --version \
  && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build must NOT require Postgres. Railway private hostnames (*.railway.internal)
# are unavailable during `docker build`. CMS routes use `connection()` so Next
# skips prerendering DB-backed pages. Do not pass DATABASE_URL here.
ARG PAYLOAD_SECRET=build-time-placeholder-not-for-production
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:3000
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV DATABASE_URL=

RUN corepack enable && corepack prepare pnpm@10.34.9 --activate \
  && pnpm --version \
  && pnpm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Next.js standalone server
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Payload migrate tooling for Railway Pre-deploy (private network only).
# Uses `node ./node_modules/payload/bin.js migrate` — no Corepack/pnpm download at runtime.
COPY --from=builder --chown=nextjs:nodejs /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/scripts/run-migrations.sh ./scripts/run-migrations.sh

RUN chmod +x ./scripts/run-migrations.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Runtime only — migrations belong in Railway Pre-Deploy Command
CMD ["node", "server.js"]
