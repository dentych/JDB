FROM node:7.5-alpine

MAINTAINER dentych

ADD . /nodeapp/

WORKDIR /nodeapp

CMD ["./start.sh"]
