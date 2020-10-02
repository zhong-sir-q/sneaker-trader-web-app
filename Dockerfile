# syntax=docker/dockerfile:experimental
FROM node:slim
WORKDIR /usr/src/app

COPY . .

RUN npm install -g typescript

# install the dependencies in backend
RUN npm install --prefix backend

# the shared folder contains the types which the backend depends
# the backend points the project reference to the shared folder
# so the build enables the backend to access the type from the backend
RUN npm run buildBackend
# this does not work atm
RUN --mount=type=secret,id=backend_app_secret,dst=./backend/.env.production cat ./backend/.env.production

EXPOSE 4000
CMD ["node", "./backend/build/src/start.js"]