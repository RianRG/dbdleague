import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { dataSource } from "../lib/typeorm/config";
import { Challenge } from "../repositories/schemas/challenge";
import { ChallengeRepository } from "../repositories/challengeRepository";
import { UpdateChallenge } from "../services/update-challenge";

const ReqParser = z.object({
  params: z.object({
    challengeId: z.string()
  }),
  body: z.object({
    winner: z.number().min(0).max(1),
    looser: z.number().min(0).max(1)
  })
})

type ReqType = z.infer<typeof ReqParser>

dataSource
  .initialize()
  .then(() =>{
    console.log('runnin datasource')
  })
  .catch(err =>{
    console.log(err)
  })

export async function finishChallenge(app: FastifyInstance){
  app.post('/challenges/finish/:challengeId', async (req: ReqType, res) =>{
    const { challengeId } = req.params;
    const { winner, looser } = req.body;

    if(winner == looser)
      return res.status(400).send({ msg: 'winner and looser cannot be the same' })

    const challenge = await dataSource.getRepository(Challenge).find({
      where: {
        id: challengeId
      },
      relations: {
        challengersOn: true
      }
    })

    const challengeRepository = new ChallengeRepository(dataSource);
    const updateChallenge = new UpdateChallenge(challengeRepository)

    console.log(challenge[0])
    const updatedChallenge = {
      ...challenge[0],
      endedAt: new Date(),
      winner: challenge[0].challengersOn[winner],
      looser: challenge[0].challengersOn[looser]
    }
//oi
    console.log(updatedChallenge)
    await updateChallenge.execute(challenge[0], updatedChallenge)

    return res.status(201).send({ msg: 'Challenge updated successfully!' })
  })
}