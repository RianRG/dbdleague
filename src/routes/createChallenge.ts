import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { dataSource } from "../lib/typeorm/config";
import { ChallengeRepository } from "../repositories/challengeRepository";
import { CreateChallenge } from "../services/create-challenge";
import { Challenge } from "../repositories/schemas/challenge";
import { ChallengerRepository } from "../repositories/challengerRepository";
import { FindChallengerByEmail } from "../services/find-challenger";
import { Challenger } from "../repositories/schemas/challenger";

const ReqParser = z.object({
  body: z.object({
    email: z.string()
  }),
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
    const datas = await dataSource.getRepository(Challenge).find();
    // datas.forEach(async (k) =>{
    //   await dataSource.getRepository(Challenge).delete(k.id)
    // })
    
    const { email } = parsedReq.body

    const challengeRepository = new ChallengeRepository(dataSource);
    const createChallenge = new CreateChallenge(
      challengeRepository
    )

    const challengerRepository = new ChallengerRepository(dataSource)
    const findChallenger = new FindChallengerByEmail(challengerRepository)

    const challenger = await findChallenger.execute(email);

    if(!challenger)
      throw new Error('This user doesnt exist')

    // console.log(challenger);

    // const challenge = await createChallenge.execute({
    //   owner: challenger.nick,
    //   challengersOn: [challenger]
    // })
    
    console.log(datas[0].challengersOn);
  })
}