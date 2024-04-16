import fastify from 'fastify';
import { GetLink } from './routes/getLink';
import fastifyOAuth2 from '@fastify/oauth2';

const app = fastify();
app.register(GetLink)

export { app };