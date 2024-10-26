import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { dataSource } from "../lib/typeorm/config";
import { ChallengeRepository } from "../repositories/challengeRepository";
import { CreateChallenge } from "../services/create-challenge";
import { Challenge } from "../repositories/schemas/challenge";
import { ChallengerRepository } from "../repositories/challengerRepository";
import { FindChallenger } from "../services/find-challenger";
import { Challenger } from "../repositories/schemas/challenger";
import { UpdateChallenger } from "../services/update-challenger";
import { pubSub } from "../utils/pubSub";

const ReqParser = z.object({
  body: z.object({
    email: z.string(),
    settings: z.object({
      region: z.string(),
      onlySameRegion: z.boolean(),
      onlyRank: z.array(z.number())
    })
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
    const datas = await dataSource.getRepository(Challenge).find({
      relations: {
        challengersOn: true
      }
    });
    // datas.forEach(async (k) =>{
    //   await dataSource.getRepository(Challenge).delete(k.id)
    // })
    console.log(datas);
    const { email, settings } = ReqParser.parse(req).body

    const challengeRepository = new ChallengeRepository(dataSource);
    const createChallenge = new CreateChallenge(
      challengeRepository
    )

    const challengerRepository = new ChallengerRepository(dataSource)
    const findChallenger = new FindChallenger(challengerRepository)

    const challenger = await findChallenger.findByEmail(email);

    if(!challenger)
      throw new Error('This user doesnt exist')


    if(challenger.challengeIn) throw new Error('You cannot enter in 2 challenges at the same time!')
      
    const challenge: any = await createChallenge.execute({
      owner: challenger.nick,
      challengersOn: [challenger],
      settings
    })


    const updatedChallenger = {
      ...challenger,
      challengeIn: challenge
    }
    const updateChallenger = new UpdateChallenger(challengerRepository);

    await updateChallenger.execute(challenger, updatedChallenger)

    pubSub.publish(challenge.id, {
      challengersOn: 1,
      createdAt: challenge.createdAt
    })

    res.status(201).send(challenge)
  })
}