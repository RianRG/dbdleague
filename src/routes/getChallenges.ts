import { FastifyInstance } from "fastify";
import { dataSource } from "../lib/typeorm/config";
import { ChallengeRepository } from "../repositories/challengeRepository";
import { GetChallenges } from "../services/get-challenges";


dataSource
  .initialize()
  .then(() =>{
    console.log('runnin datasource')
  })
  .catch(err =>{
    console.log(err);
  })


export async function getChallengesRoute(app: FastifyInstance){
  app.get('/challenges', async(req, res) =>{
    const challengeRepository = new ChallengeRepository(dataSource);
    const getChallenges = new GetChallenges(challengeRepository)

    const challenges = await getChallenges.execute();

    if(!challenges) throw new Error('An error occurred!')

    res.status(200).send({ challenges });
  })
}