FROM node:20

EXPOSE 8082

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
CMD npm start
