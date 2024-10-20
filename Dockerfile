FROM node:20.12.2 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20.12.2-alpine
WORKDIR /app
COPY --from=build /app .
RUN npm uninstall bcrypt
RUN npm install bcrypt
CMD ["node", "dist/main.js"]
