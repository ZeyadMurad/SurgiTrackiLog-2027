# SurgiTrack iLog — multi-stage production image.
# Build:  docker build -t surgitrack-ilog .
# Run:    docker run -p 3000:3000 --env-file .env surgitrack-ilog

# ---------- Build stage ----------
FROM oven/bun:1 AS build
WORKDIR /app

# Install deps with cache-friendly layer ordering.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build the client bundle (vite build → dist/).
COPY . .
RUN bun run build

# ---------- Runtime stage ----------
FROM oven/bun:1 AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
# Trust exactly one reverse-proxy tier by default (Cloud Run LB / container LB).
# Override at deploy time to match your proxy chain.
ENV TRUSTED_PROXY_HOPS=1

# Production dependencies only; skip the husky `prepare` script (dev tooling).
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production --ignore-scripts

# Built client bundle + the TypeScript server (bun runs TS natively, no tsx needed).
COPY --from=build /app/dist ./dist
COPY server.ts tsconfig.json vite.config.ts ./
COPY src/ ./src/
COPY public/ ./public/

EXPOSE 3000

# Bun executes server.ts directly (NODE_ENV=production → serves dist/).
CMD ["bun", "server.ts"]
