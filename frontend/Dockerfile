FROM node:24-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# -------------------------
# DEVELOPMENT STAGE
# -------------------------
FROM base AS development

EXPOSE 5173

# Start Vite dev server — bind to 0.0.0.0 for Docker access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# -------------------------
# PRODUCTION STAGE
# -------------------------
FROM base AS production

# Build static assets
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Serve with a lightweight static server
RUN npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
