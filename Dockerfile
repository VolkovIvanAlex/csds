# Stage 1: Build
FROM node:22-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only the lockfile and package.json for faster cache
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY tsconfig.json ./

# Install deps
COPY . .
RUN pnpm install --frozen-lockfile

# Build the Next.js app
RUN pnpm build

# Stage 2: Run
FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "start"]