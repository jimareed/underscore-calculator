FROM node
ADD src /src
WORKDIR /app
RUN cd /src; npm install
EXPOSE 8080
CMD ["node", "/src/start.js"]