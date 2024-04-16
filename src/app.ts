import fastify from 'fastify';
import { authDiscord } from './routes/authDiscord';
import fastifyOAuth2 from '@fastify/oauth2';
import { getSession } from './routes/getSession';

const app = fastify();
app.register(authDiscord)
app.register(getSession)

export { app };