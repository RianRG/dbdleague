import { FastifyInstance } from "fastify";

export async function authDiscord(app: FastifyInstance){
  app.get('/auth/discord', async (req, res) =>{
    res.redirect('https://discord.com/oauth2/authorize?client_id=1229846501207969914&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fsession&scope=email+identify+gdm.join+guilds+guilds.join+connections')
    res.send({ msg: 'Logged succesfully!' })
  })
}