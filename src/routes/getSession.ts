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

interface Session{
  refreshToken: string;
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
    const challenger = await dataSource.getRepository(Challenger).create({
      email: 'a@a.com',
      nick: 'nickname',
      rank: 33,
      avatarUrl: 'kdkajd'
    })
    await dataSource.getRepository(Challenger).save(challenger)

    const challengers = await dataSource.getRepository(Challenger).find()
    console.log(challengers);
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
      
      res.send(session)
    } else{
      const userInfo: any = await getDiscordSession.getBySessionId(res.unsignCookie(sessionId).value)
      res.send(userInfo)
    }
  })
}