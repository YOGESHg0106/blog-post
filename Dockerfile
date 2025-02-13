# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy backend files and install dependencies
COPY backend ./backend
WORKDIR /app/backend
RUN npm install

# Expose the backend port
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
