# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build argument for GitHub Pages
ARG GITHUB_ACTIONS=false
ENV GITHUB_ACTIONS=${GITHUB_ACTIONS}

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve to run static files
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/out ./out

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["serve", "-s", "out", "-l", "3000"]
