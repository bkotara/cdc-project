FROM node:10.14.1-alpine
RUN mkdir /src
WORKDIR /src
ADD package-lock.json package-lock.json
ADD package.json package.json
RUN npm install
ADD data-parse.js data-parse.js
ADD index.js index.js
ADD cache.json cache.json
EXPOSE 3001
CMD node index.js
