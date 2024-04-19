import fastify from 'fastify';
import { authDiscord } from './routes/authDiscord';
import websocket from '@fastify/websocket';
import cookie from '@fastify/cookie'
import { getSession } from './routes/getSession';
import plugin from 'typeorm-fastify-plugin';
import { createChallengeRoute } from './routes/createChallenge';
import { getChallengesRoute } from './routes/getChallenges';
const app = fastify();

app.register(websocket);
app.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  hook: 'onRequest'
})

app.register(authDiscord)
app.register(getSession)
app.register(createChallengeRoute)
app.register(getChallengesRoute)

export { app };