import { FastifyInstance } from "fastify";
import z from 'zod';
import { GetDiscordSession } from "../services/get-discord-session";
import axios from "axios";
import { randomUUID } from 'node:crypto'

const ReqQueryParser = z.object({
  query: z.object({
    code: z.string()
  }),
  cookies: z.object({
      sessionId: z.string().optional()
  }).optional()
})

type ReqQueryType = z.infer<typeof ReqQueryParser>

export async function getSession(app: FastifyInstance){
  app.get('/session', async (req: ReqQueryType, res) =>{
    
    const getDiscordSession = new GetDiscordSession();

    const parsedReq = ReqQueryParser.parse(req);
    const { code } = parsedReq.query
    let { sessionId } = parsedReq.cookies
    console.log(sessionId)
    console.log(sessionId==='undefined')
    if(!sessionId || sessionId==='undefined'){
      const session: any = await getDiscordSession.get(code);
      sessionId = session?.refresh?.access_token;
      res.setCookie('sessionId', sessionId, {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      })
      
      if(session == -1) res.redirect('http://localhost:5000/auth/discord')
      res.send({ session })
    } else{
      const userInfo: any = await getDiscordSession.getBySessionId(sessionId)

      res.send(userInfo)
    }
    
  })
}