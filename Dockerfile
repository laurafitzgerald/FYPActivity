
FROM node
# replace this with your application's default port


ADD service /service
ADD package.json /package.json

RUN npm install

CMD ["node", "/service/service.js"]
