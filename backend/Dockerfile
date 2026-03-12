FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of source code
COPY . .

# Expose API port
EXPOSE 3000

# Use dev mode with hot reload, swap to "start" for production
CMD ["npm", "run", "dev"]