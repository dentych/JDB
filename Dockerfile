FROM node:4-onbuild
# replace this with your application's default port
EXPOSE 80
You can then build and run the Docker image:

docker build -t app.js .
docker run -it --rm --name my-running-app app.js
