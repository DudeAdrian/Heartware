# ╔════════════════════════════════════════════════════════════════════════════╗
# ║  HEARTWARE CHAMBER 5 - DOCKER CONFIGURATION                               ║
# ║  Multi-stage build for optimized production deployment                    ║
# ║  Build for Generations - Century-Scale Architecture                       ║
# ╚════════════════════════════════════════════════════════════════════════════╝

# ═════════════════════════════════════════════════════════════════════════════
# STAGE 1: Build
# ═════════════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy-peer-deps for compatibility
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ═════════════════════════════════════════════════════════════════════════════
# STAGE 2: Production
# ═════════════════════════════════════════════════════════════════════════════
FROM nginx:alpine

# Install envsubst for environment variable substitution
RUN apk add --no-cache gettext

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script for env variable injection
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Expose port
EXPOSE 80

# Use custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
