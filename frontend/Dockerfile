FROM node:24-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start dev server — bind to 0.0.0.0 for Docker access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
