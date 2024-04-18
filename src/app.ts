import fastify from 'fastify';
import { authDiscord } from './routes/authDiscord';
import websocket from '@fastify/websocket';
import cookie from '@fastify/cookie'
import { getSession } from './routes/getSession';
import plugin from 'typeorm-fastify-plugin';
const app = fastify();

app.register(websocket);
app.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  hook: 'onRequest'
})

// app.register(plugin, {
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'docker',
//   password: 'docker',
//   database: 'mypostgres',
//   entities: ['/repositories/schemas/*.ts'],
//   synchronize: true
// }).ready()


app.register(authDiscord)
app.register(getSession)

export { app };