import { FastifyInstance } from "fastify";
import z from 'zod';
import { GetDiscordSession } from "../services/get-discord-session";
import { dataSource } from "../lib/typeorm/config";
import { CreateChallenger } from "../services/create-challenger";
import { ChallengerRepository } from "../repositories/challengerRepository";
import { FindChallengerByEmail } from "../services/find-challenger";
import { Challenger } from "../repositories/schemas/challenger";
import { pubSub } from "../utils/pubSub";

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
    const datas = await dataSource.getRepository(Challenger).find({
      relations: {
        challengeIn: true
      }
    })

    // datas.forEach(async (k) =>{
    //   await dataSource.getRepository(Challenger).delete(k.id)
    // })
    
    console.log(datas);

    const parsedReq = ReqParser.parse(req);
    const { code } = parsedReq.query
    let { sessionId } = parsedReq.cookies
    
    if(sessionId && sessionId!=='undefined'){
      const userInfo: Session = await getDiscordSession.getBySessionId(res.unsignCookie(sessionId).value)
      res.send(userInfo)
    }

    const challengerRepository = new ChallengerRepository(dataSource);

    const session: Session = await getDiscordSession.get(code);
    
    if(!session || !code) res.status(401).send({ msg: 'Unauthorized!' })

    sessionId = session.refreshToken;
    res.setCookie('sessionId', sessionId, {
      path: '/',
      httpOnly: true,
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    })

    const findChallengerByEmail = new FindChallengerByEmail(challengerRepository);
    const challengerExists = await findChallengerByEmail.execute(session.user.email)
      
    if(!challengerExists){
      const challenger = {
        nick: session.user.global_name,
        email: session.user.email,
        avatarUrl: session.user.avatar,
        rank: 0,
        sessionId
      } 

      const createChallenger = new CreateChallenger(challengerRepository)
      createChallenger.execute(challenger);
    }
    
    res.send(session)
  })
}