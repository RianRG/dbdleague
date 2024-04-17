import { FastifyInstance } from "fastify";
import z from 'zod';
import { GetDiscordSession } from "../services/get-discord-session";

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
    
    if(!sessionId || sessionId==='undefined'){
      const session: any = await getDiscordSession.get(code);

      if(session == -1) res.redirect('http://localhost:5000/auth/discord')
      sessionId = session?.refresh?.access_token;
      res.setCookie('sessionId', sessionId, {
        path: '/',
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      })
      
      res.send({ session })
    } else{
      const userInfo: any = await getDiscordSession.getBySessionId(res.unsignCookie(sessionId).value)

      res.send(userInfo)
    }
    
  })
}