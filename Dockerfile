FROM node:20-alpine
WORKDIR /app
COPY src ./src
COPY server ./server
CMD ["node", "server/server.js"]
