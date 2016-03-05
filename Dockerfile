
FROM node
# replace this with your application's default port


ADD service /service

RUN cd /service; npm install

CMD ["node", "/service/service.js"]
