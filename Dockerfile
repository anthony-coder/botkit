FROM node:slim

COPY . /app

RUN cd /app \
  && npm install --production
#RUN apt-get update -y
#RUN apt-get install vim -y
#RUN apt-get install git -y
WORKDIR /app/examples/
EXPOSE 5000
ENV clientId=118636349169.119431977653
ENV clientSecret=5a95875ebc11904fb496f50a957bfcdc
ENV port=5000
ENV NODE_DEBUG=request

ENTRYPOINT ["/usr/local/bin/node", "slackbutton_bot_interactivemsg.js"]

