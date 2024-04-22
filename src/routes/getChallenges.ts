import { FastifyInstance } from "fastify";
import { pubSub } from "../utils/pubSub";
import { z } from "zod";


export async function getChallengesRoute(app: FastifyInstance){
  app.get('/challenges/:challengeId', { websocket: true }, async (connection, req) =>{

    const reqParser = z.object({
      challengeId: z.string()
    })

    const { challengeId } = reqParser.parse(req.params);

    pubSub.subscribe(challengeId, msg =>{
      connection.send(JSON.stringify(msg))
    })
  })
}