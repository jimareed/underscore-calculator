FROM node
ADD src /src
ADD src/views /src/views
ADD src/views/layouts /src/views/layouts
ADD src/public /src/public
RUN cd /src; npm install
EXPOSE 8080
CMD ["node", "/src/start.js"]