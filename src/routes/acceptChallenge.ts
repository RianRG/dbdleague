import { FastifyInstance } from "fastify";
import { dataSource } from "../lib/typeorm/config";
import { z } from "zod";
import { ChallengeRepository } from "../repositories/challengeRepository";
import { UpdateChallenge } from "../services/update-challenge";
import { FindChallenger } from "../services/find-challenger";
import { ChallengerRepository } from "../repositories/challengerRepository";
import { GetChallenge } from "../services/get-challenge";
import { UpdateChallenger } from "../services/update-challenger";
import { pubSub } from "../utils/pubSub";


dataSource
  .initialize()
  .then(() =>{
    console.log('runnin datasource')
  })
  .catch(err =>{
    console.log(err);
  })

const reqParser = z.object({
    params: z.object({
      challengeId: z.string()
    }),
    body: z.object({
      email: z.string()
    })
})

type ReqType = z.infer<typeof reqParser>
export async function acceptChallengeRoute(app: FastifyInstance){
  app.post('/challenge/accept/:challengeId', async (req: ReqType, res) =>{
    const { challengeId } = reqParser.parse(req).params;
    const { email } = reqParser.parse(req).body
    console.log(challengeId)

    if(!email) throw new Error('Unauthorized!');
    const challengeRepository = new ChallengeRepository(dataSource)
    const challengerRepository = new ChallengerRepository(dataSource)

    const updateChallenger = new UpdateChallenger(challengerRepository)
    const updateChallenge = new UpdateChallenge(challengeRepository);
    const findChallenger = new FindChallenger(challengerRepository);
    const findChallenge = new GetChallenge(challengeRepository);

    const challenger = await findChallenger.findByEmail(email);

    if(!challenger) throw new Error('Unauthorized!');

    if(challenger.challengeIn) throw new Error('You cannot accept 2 challenges at the same time!')

    const challenge = await findChallenge.execute(challengeId);
    const { settings } = challenge;

    if(settings.onlyRank[0] > challenger.rank || settings.onlyRank[1] < challenger.rank)
      return res.status(400).send({ msg: 'Your rank is not acceptable for this challenge!' })

    if(settings.onlySameRegion==true && challenger.region !== settings.region)
      return res.status(400).send({ msg: 'Your region is not acceptable for this challenge"' })

    const updatedChallenge = {
      ...challenge,
      challengersOn: [challenge.challengersOn[0], challenger]
    }

    const updatedChallenger = {
      ...challenger,
      challengeIn: challenge
    }

    await updateChallenge.execute(challenge, updatedChallenge);
    await updateChallenger.execute(challenger, updatedChallenger);

    pubSub.publish(challenge.id, {
      challengersOn: 2,
      createdAt: challenge.createdAt
    })

    res.status(201).send({ msg: 'challenge accepted!' });
  })
}