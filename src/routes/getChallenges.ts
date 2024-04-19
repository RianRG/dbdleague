import { FastifyInstance } from "fastify";
import { GetChallenges } from "../services/get-challenges";
import { dataSource } from "../lib/typeorm/config";
import { ChallengeRepository } from "../repositories/challengeRepository";
import { pubSub } from "../utils/pubSub";
dataSource
  .initialize()
  .then(() =>{
    console.log('runnin datasource')
  })
  .catch(err =>{
    console.log(err);
  })


export async function getChallengesRoute(app: FastifyInstance){
  app.get('/challenges', { websocket: true }, async (connection, req) =>{
    const challengeRepository = new ChallengeRepository(dataSource);
    const getChallenges = new GetChallenges(challengeRepository);

    const challenges = await getChallenges.execute();

    challenges.forEach(challenge =>{
      pubSub.subscribe(challenge.id, msg =>{
        connection.send(JSON.stringify(msg))
      })
    })
  })
}