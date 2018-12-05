FROM node:10.14.1-alpine
RUN mkdir /src
WORKDIR /src
ADD package-lock.json package-lock.json
ADD package.json package.json
RUN npm install
ADD public public
ADD src src
EXPOSE 3001
CMD npm start
