FROM node:alpine

WORKDIR '/blockchain-store'

COPY /package.json ./
RUN yarn install
COPY . .

CMD ["yarn", "start"]