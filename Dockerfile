# Use official Bun image
FROM oven/bun:1-debian AS base

# Install OpenSSL (required by Prisma)
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lock* ./
# Copy prisma schema BEFORE install (needed for postinstall script)
COPY prisma ./prisma
RUN bun install --frozen-lockfile --production

# Build stage - already has Prisma Client from postinstall
FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY --from=install /app/prisma ./prisma
COPY . .

# Production stage
FROM base AS release
COPY --from=install /app/node_modules ./node_modules
COPY --from=build /app .

# Expose port (Railway will set this via $PORT env var)
EXPOSE 8080

# Set user (security best practice)
USER bun

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e 'fetch("http://localhost:" + (process.env.PORT || 8080) + "/health").then(r => r.ok ? process.exit(0) : process.exit(1))'

# Start the application
CMD ["bun", "run", "start"]
