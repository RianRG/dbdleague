import fastify from 'fastify';
import { authDiscord } from './routes/authDiscord';
import websocket from '@fastify/websocket';
import cookie from '@fastify/cookie'
import { getSession } from './routes/getSession';
import plugin from 'typeorm-fastify-plugin';
import { createChallengeRoute } from './routes/createChallenge';
import { getChallengeRoute } from './routes/getChallenge';
import { acceptChallengeRoute } from './routes/acceptChallenge';
import { finishChallenge } from './routes/finishChallenge';
const app = fastify();

app.register(websocket);
app.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  hook: 'onRequest'
})

app.register(authDiscord)
app.register(getSession)
app.register(createChallengeRoute)
app.register(getChallengeRoute)
app.register(acceptChallengeRoute)
app.register(finishChallenge)

export { app };