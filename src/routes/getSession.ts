import { FastifyInstance } from "fastify";
import z from 'zod';
import { GetDiscordSession } from "../services/get-discord-session";

const ReqParser = z.object({
  query: z.object({
    code: z.string().optional()
  }),
  cookies: z.object({
      sessionId: z.string().optional()
  }).optional()
})

interface Session{
  refresh: {
    access_token: string;
  }
}

type ReqType = z.infer<typeof ReqParser>

export async function getSession(app: FastifyInstance){
  app.get('/session', async (req: ReqType, res) =>{
    
    const getDiscordSession = new GetDiscordSession();

    const parsedReq = ReqParser.parse(req);
    const { code } = parsedReq.query
    let { sessionId } = parsedReq.cookies
    
    if(!sessionId || sessionId==='undefined'){
      const session: Session = await getDiscordSession.get(code);

      if(!session || !code) res.status(401).send({ msg: 'Unauthorized!' })

      sessionId = session.refresh.access_token;
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