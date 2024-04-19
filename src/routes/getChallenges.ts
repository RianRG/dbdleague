import { FastifyInstance } from "fastify";

export async function getChallengesRoute(app: FastifyInstance){
  app.get('/challenges', { websocket: true }, async (connection, req) =>{
    
  })
}