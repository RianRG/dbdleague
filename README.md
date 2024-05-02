# Dbd League Ladder System
A backend project based on dbdleague's discord bot (for 1v1s). Its a project that allows the user to create challenges and accept challenges against other users. (Some checks during this process)

## Excalidraw 

![design](https://github.com/RianRG/dbdleague/assets/134891464/5fa43bc6-839f-42e6-b22f-c705e0b2c924)


## Main concept
I'm using the discord authorization proccess on this application instead of basic jwt models. (It means the user needs to have a discord account to access it)

It uses TypeORM for the queries and store all information on a postgres database (Containerized by a docker-compose)

First the user makes login through the discord login protocol and we store his main infos on our database. (nick, email, avatarUrl, region)
*We can get also the user's color to put on frontend and make different styles*
*The region returned by discord api is not a continent, so we have to make a request to Restcountries API (restcountries.com) and save the user's continent on database*
*We need to get the user's continent for the future challenge checks (A challenge can accept ONLY challengers of the same region)*

Then, the user can create a challenge, accept a challenge, list all challenges, get dinamic infos about a challenge through a websocket protocol. (Pubsub design pattern)

## Technical Details
* NodeJS
* Typescript
* Typeorm
* Docker-compose
* Postgres
* zod
* Discord Authorization System
* Websocket (not socket.io)
* Fastify
* axios
* Cookies

## How to use

Install the requirements running this command:
```
pnpm install
```
