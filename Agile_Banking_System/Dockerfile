# Stage 1: Build the React portal (Apex Banking Systems)
FROM node:20-alpine AS builder

WORKDIR /app
COPY BANK--AGILE/package*.json ./
RUN npm install

COPY BANK--AGILE/ ./
RUN npm run build

# Stage 2: Serve the main Vanilla JS application and the built React portal
FROM nginx:alpine

# Copy the main Agile Banking System (Meridian Bank) static files
COPY . /usr/share/nginx/html

# Replace the apex-portal directory with the freshly built React assets from Stage 1
# (This ensures the Docker image always has the latest React build)
RUN rm -rf /usr/share/nginx/html/apex-portal && mkdir -p /usr/share/nginx/html/apex-portal
COPY --from=builder /app/dist /usr/share/nginx/html/apex-portal

# Expose port 80
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
