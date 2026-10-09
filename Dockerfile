# ForgeAI MERN app — build the Vite client, run the Express server
FROM node:20-alpine AS client-build
WORKDIR /app

# Copy package configurations first for caching
COPY package.json ./
COPY client/package.json ./client/
RUN npm install --prefix client

# Copy all code (including configuration files like vite.config.js in client/)
COPY client ./client
RUN npm run build --prefix client

# Production Runner
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
RUN npm install --omit=dev

COPY server ./server
COPY --from=client-build /app/client/dist ./client/dist

EXPOSE 4000
CMD ["node", "server/index.js"]