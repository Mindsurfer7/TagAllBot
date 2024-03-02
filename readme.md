// "rewrites": [
// {
// "source": "**",
// "function": "app"
// }
// ]
FROM node:16-alpine

WORKDIR /app

# Копируем зависимости приложения

COPY package\*.json ./

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "node", "tag-all-server.js" ]
