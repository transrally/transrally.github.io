FROM node:20
WORKDIR /opt/transrally.github.io/
COPY ./ /opt/transrally.github.io/
CMD [ "node","/opt/transrally.github.io/server.js" ]
EXPOSE 8080