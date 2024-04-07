#node服务器
FROM node:16
LABEL name="blog-express4"
LABEL version="latest"
RUN mkdir -p /usr/src
COPY . /usr/src
WORKDIR /usr/src
RUN npm install
EXPOSE 4000
# CMD ["node","app.js"]
CMD ["pm2-runtime","app.js"]