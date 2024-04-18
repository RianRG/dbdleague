import { FastifyInstance } from "fastify";
import z from 'zod';
import { GetDiscordSession } from "../services/get-discord-session";
import { dataSource } from "../lib/typeorm/config";
import { Challenger } from "../repositories/schemas/challenger";

const ReqParser = z.object({
  query: z.object({
    code: z.string().optional()
  }),
  cookies: z.object({
      sessionId: z.string().optional()
  }).optional()
})

export interface User {
  id: string
  username: string
  avatar: string
  discriminator: string
  public_flags: number
  flags: number
  banner: any
  accent_color: any
  global_name: string
  avatar_decoration_data: any
  banner_color: any
  clan: any
  mfa_enabled: boolean
  locale: string
  premium_type: number
  email: string
  verified: boolean
}


interface Session{
  user: User;
  refreshToken?: string;
}

dataSource
  .initialize()
  .then(() =>{
    console.log('runnin datasource')
  })
  .catch(err =>{
    console.log(err);
  })


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
        
        sessionId = session.refreshToken;
        res.setCookie('sessionId', sessionId, {
          path: '/',
          httpOnly: true,
          signed: true,
          maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        })
        
        const challenger = dataSource.getRepository(Challenger).create({
          nick: session.user.global_name,
          email: session.user.email,
          avatarUrl: session.user.avatar,
          rank: 0
        })
        await dataSource.getRepository(Challenger).save(challenger)

        const datas = await dataSource.getRepository(Challenger).find();
        console.log(datas);
        res.send(session)
    } else{
      const userInfo: any = await getDiscordSession.getBySessionId(res.unsignCookie(sessionId).value)
      res.send(userInfo)
    }
  })
}