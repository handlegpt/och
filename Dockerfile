# Multi-stage build for production optimization
FROM node:20-alpine AS builder

# Install curl for health check
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Set build-time environment variables
ARG GEMINI_API_KEY
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_SENTRY_DSN
ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG VITE_GA_TRACKING_ID
ENV GEMINI_API_KEY=$GEMINI_API_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY
ENV VITE_GA_TRACKING_ID=$VITE_GA_TRACKING_ID

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install curl for health check
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install http-server as a local dependency instead of global
RUN npm install http-server && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy custom server script
COPY server.cjs ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S ochai -u 1001

# Change ownership of the app directory
RUN chown -R ochai:nodejs /app
USER ochai

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4173/health || exit 1

# Start the application using custom server with SPA routing support
CMD ["node", "server.cjs"]
