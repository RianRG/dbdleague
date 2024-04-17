import { FastifyInstance, FastifyRequest } from "fastify";
import url from 'url';
import axios from 'axios';
import z from 'zod';

const ReqQueryParser = z.object({
  query: z.object({
    code: z.string()
  })
})

type ReqQueryType = z.infer<typeof ReqQueryParser>

export async function getSession(app: FastifyInstance){
  app.get('/session', async (req: ReqQueryType, res) =>{


    const code = ReqQueryParser.parse(req.query.code);
    
    if(!code)
      res.redirect('http://localhost:5000/auth/discord')

    const formData = new url.URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code.toString(),
      redirect_uri: 'http://localhost:5000/session'
    })

    const output: any = await axios.post('https://discord.com/api/v10/oauth2/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).catch(err =>{
      res.redirect('http://localhost:5000/auth/discord')
    })

    const access = output.data.access_token
    const userInfo = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: {
        'Authorization': `Bearer ${access}`
      }
    })

    const formDataForRefresh = new url.URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: output.data.refresh_token
    })

    const refresh = await axios.post('https://discord.com/api/v10/oauth2/token', formDataForRefresh, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log(output.data, userInfo.data, refresh.data)
    
    res.send({ msg: 'logged' })
  })
}