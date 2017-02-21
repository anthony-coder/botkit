FROM node:slim

COPY . /app

RUN cd /app \
  && npm install --production
RUN apt-get update -y
RUN apt-get install vim -y
RUN apt-get install git -y
WORKDIR /app
