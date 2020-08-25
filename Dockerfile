FROM node:slim
WORKDIR /usr/src/app

COPY . .

RUN npm install -g typescript pm2
# the shared folder contains the types which the backend depends
# the backend points the project reference to the shared folder
# so the build enables the backend to access the type from the backend
RUN npm run buildBackend
# install the dependencies in backend
RUN npm install --prefix backend
EXPOSE 4000
# pm2-runtime starts the app in the foreground
CMD ["pm2-runtime", "start", "./backend/build/src/app.js"]