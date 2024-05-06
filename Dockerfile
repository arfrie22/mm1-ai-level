FROM node:current-alpine3.18

WORKDIR /app

RUN  npm install -g pnpm
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["node", "build"]