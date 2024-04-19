import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { dataSource } from "../lib/typeorm/config";
import { ChallengeRepository } from "../repositories/challengeRepository";
import { CreateChallenge } from "../services/create-challenge";
import { Challenge } from "../repositories/schemas/challenge";

const ReqParser = z.object({
  body: z.object({
    nick: z.string()
  }),
  cookies: z.object({
    sessionId: z.string()
  })
})

dataSource
  .initialize()
  .then(() =>{
    console.log('runnin datasource')
  })
  .catch(err =>{
    console.log(err);
  })

  type ReqType = z.infer<typeof ReqParser>

export async function createChallengeRoute(app: FastifyInstance){
  app.post('/challenge', async (req: ReqType, res) =>{
    const parsedReq = ReqParser.parse(req);

    const { nick } = parsedReq.body
    const { sessionId } = parsedReq.cookies

    console.log(sessionId)
    const challengeRepository = new ChallengeRepository(dataSource);
    const createChallenge = new CreateChallenge(
      challengeRepository
    )

    createChallenge.execute({
      owner: nick,
      // challengersOn: []
    })

    const datas = await dataSource.getRepository(Challenge).find();
    console.log(datas);
  })
}