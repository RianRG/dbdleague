import { FastifyInstance } from "fastify";
import { dataSource } from "../lib/typeorm/config";
import { z } from "zod";
import { ChallengeRepository } from "../repositories/challengeRepository";
import { UpdateChallenge } from "../services/update-challenge";
import { FindChallenger } from "../services/find-challenger";
import { ChallengerRepository } from "../repositories/challengerRepository";


dataSource
  .initialize()
  .then(() =>{
    console.log('runnin datasource')
  })
  .catch(err =>{
    console.log(err);
  })

const reqParser = z.object({
    challengeId: z.string(),
    sessionId: z.string()
})

type ReqType = z.infer<typeof reqParser>
export async function acceptChallengeRoute(app: FastifyInstance){
  app.post('/challenge/accept/:challengeId', async (req, res) =>{
    const { challengeId } = reqParser.parse(req.params)
    const { sessionId } = reqParser.parse(req.cookies);

    if(!sessionId) throw new Error('Unauthorized!');

    const challengeRepository = new ChallengeRepository(dataSource)
    const challengerRepository = new ChallengerRepository(dataSource)

    const updateChallenge = new UpdateChallenge(challengeRepository);
    const findChallenger = new FindChallenger(challengerRepository);

    const challenger = findChallenger.findBySessionId(sessionId);

    if(!challenger) throw new Error('Unauthorized!');

    
  })
}