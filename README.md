# Lyrebird Voice Tournament Sample App

![LVT](microphone.png)

This project aims to provide a sample use case of the Lyrebird Custom Avatar API.
You can have a look at the deployed version at: [Example App](https://tournament.lyrebird.ai/).
This sample was implemented using [Lyrebird Vocal Avatar API](http://docs.raccoon.lyrebird.ai/avatar_api/0_getting_started.html).

## Getting Started
### Prerequisites

You’ll need to install:
* Node Js - [Download | Node.js](https://nodejs.org/en/download/)
* Docker - [Docker Documentation | Docker Documentation](https://docs.docker.com/)
* Docker-compose - [Install Docker Compose | Docker Documentation](https://docs.docker.com/compose/install/)

### Installing
#### Creating a Lyrebird application
Go to [Lyrebird  My Voice Application](https://myvoice.raccoon.lyrebird.ai/applications) and create an application. Please note the `CLIENT_ID` and `CLIENT_SECRET` provided to you.
In the [.env](./.env) file in the root folder ion this application, edit the variable `LYREBIRD_CLIENT_ID` and `LYREBIRD_CLIENT_SECRET` with the ones just given to you.

#### Starting the sample application
To Start the sample application, you can either use docker-compose (faster) or start it manually.

##### Using Docker
* `cd lyrebird-tournament-app/`
* `docker-compose up`
* Navigate to http://localhost:4040

##### Manually
* Install mongo-db [Install MongoDB — MongoDB Manual](https://docs.mongodb.com/manual/installation/)
* Edit the `DB_URL` in [.env](./.env) file to point it to your local MongoDb instance
* `cd lyrebird-tournament-app/`
* `npm install`
* `npm start`
* Navigate to http://localhost:4040

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Lyrebird APIs Terms of Service](https://lyrebird.ai/terms/evaluation).

## Slack Group
If you have some questions, please visit our slack group: [https://avatar-api-support.slack.com/](https://avatar-api-support.slack.com/).
