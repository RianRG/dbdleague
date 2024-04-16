import { FastifyInstance } from "fastify";
import url from 'url';
import axios from 'axios';

export async function getSession(app: FastifyInstance){
  app.get('/session', async (req: any, res) =>{
    const { code } = req.query;
    
    if(code){
      const formData = new url.URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: 'http://localhost:5000/session'
      })

      const output = await axios.post('https://discord.com/api/v10/oauth2/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      if(output.data){
        const access = output.data.access_token
        const userInfo = await axios.get('https://discord.com/api/v10/users/@me', {
          headers: {
            'Authorization': `Bearer ${access}`
          }
        })
        console.log(userInfo.data)
      }
    }
    
    res.send({ msg: 'logged' })
  })
}