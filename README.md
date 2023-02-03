# Lunatech Chef API

### This project is a WIP. The idea is to replace the current lunatech-lunch-planner with lunatech-chef.


This project implements an API that allows the planning of meals at Lunatech offices.

In order to plan a meal you need to create Locations, Dishes, Menus, add Dishes to a Menu and then associate a date and a Location to a Menu (creating a schedule).
After that each eser can choose if they wish to attend a scheduled meal.

The `requests` folder contains examples (and tests) on how to use the API and what is the order needed for everything to come together properly.

## How to run Lunatech-chef

### There's a docker container setup that runs the DB needed by the app

```commandline
cd /dockerdev/postgres
docker build -t lunatech-chef-api .
```
To run docker image and clean it on shutdown:
```commandline
docker run -it -m 1024m --env POSTGRES_HOST_AUTH_METHOD=trust --name postgres -p 5432:5432 lunatech-chef-api
```

### Setup ENV variables
In `src/main/resources/` folder create a file `.override.conf` providing values for the following variables

```hocon
POSTGRESQL_ADDON_HOST="localhost"
POSTGRESQL_ADDON_PORT=5432
POSTGRESQL_ADDON_DB="lunatech-chef-api"
POSTGRESQL_ADDON_USER="lunatech-chef-api"
POSTGRESQL_ADDON_PASSWORD=""

AUTH_SESSION_SECRET_KEY = "" //ask a current developer or check clever-cloud configuration
AUTH_SESSION_CLIENT_ID = "" //ask a current developer or check clever-cloud configuration

KTOR_ENV = dev
RECURRENT_SCHEDULES_CRON =  "0 */20 * ? * *" // every 20 minutes
```

In `frontend/` create the files `.env.development` and `.env.production`. The one that is needed depends on the way the app is started so having both is advised.
Both take the same information:
```hocon
REACT_APP_BASE_URL=http://localhost:8080
REACT_APP_CLIENT_ID= // ask acurrent  developer or check clever-cloud configuration
```

### Start both backend and frontend together
```commandline
gradle buildAll
gradle run
```

This will start the lunatech-chef at `http://localhost:8080`

### Start backend and frontend separately

#### To start the backend API:
```commandline
gradle run
```

#### To start the frontend:
```commandline
cd frontend/
npm start
```

### To test the API
The API can be tested by running the requests available in folder `request`, using IntelliJ.
Only authorized request are accepted. These are the steps:

1. Update the token in `http-client.env.json`.

 To get a new token you have to launch the application locally and login using the Google sign-in.
After a successful login a token can be printed by adding a log statement in login.js `handleLogin` method. 
Copy and paste it into `http-client.env.json` in `token`.

2. Update the session in `http-client.env.json`.

Run the login request in `1-login.http`.
Running this request will output a `CHEF_SESSION` string. Update the `session` in `http-client.env.json` with that string.

3. You are now ready to run the other requests.

## Deployment
The application has started being tested in a production environment by deploying it to clever-cloud. Everytime a PR is merged to `master` branch it
triggers a deployment in clever-cloud.
If you don't have access to clever-cloud you can request it to one of the following clever-cloud admins:
Gustavo de Micheli, Vincent Grente, Trevor Burton-McCreadie, Neil Benn, Willem Jan Glerum, Erik Bakker, Nicolas Leroux, Jasper Dijt.

You will see `Lunatech-chef` in the list of deployed applications and also `Lunatech-chef-api-database` running a postgres DB that supports `Lunatech-chef`.