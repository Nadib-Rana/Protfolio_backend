# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install openssl required for Prisma
RUN apk add --no-cache openssl

# Copy package metadata
COPY package*.json ./

# Install dependencies via npm
RUN npm install

# Copy source code
COPY . .

# Provide dummy DATABASE_URL for build-time Prisma client code generation
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

# Generate Prisma Client and build NestJS production bundle
RUN npx prisma generate
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Install openssl for Prisma runtime compatibility
RUN apk add --no-cache openssl

ENV NODE_ENV=production

# Copy application artifacts from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/templates ./templates

# Expose default HTTP port
EXPOSE 3000

# Execute database migrations then start NestJS server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]