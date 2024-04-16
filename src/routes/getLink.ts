import { FastifyInstance } from "fastify";

export async function GetLink(app: FastifyInstance){
  app.get('/auth/discord', async (req, res) =>{
    // res.redirect('https://discord.com/oauth2/authorize?client_id=1229801593415663628&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fdiscord&scope=email+identify+guilds+gdm.join+guilds.join+connections')
    res.send({ msg: 'Logged succesfully!' })
  })
}