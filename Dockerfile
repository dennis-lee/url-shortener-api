FROM node:20.12.2-bookworm-slim

WORKDIR /app

COPY . /app

RUN npm ci

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
