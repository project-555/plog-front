FROM node:16

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 3000

# REACT START
CMD ["yarn", "start"]