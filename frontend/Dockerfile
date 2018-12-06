FROM node:10.14.1-alpine
RUN mkdir /src
WORKDIR /src
RUN npm install -g serve
ADD build build
EXPOSE 3000
CMD serve -p 3000 -s build
