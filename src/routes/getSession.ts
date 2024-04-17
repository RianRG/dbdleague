import { FastifyInstance } from "fastify";
import z from 'zod';
import { GetDiscordSession } from "../services/get-discord-session";

const ReqQueryParser = z.object({
  query: z.object({
    code: z.string()
  })
})

type ReqQueryType = z.infer<typeof ReqQueryParser>

export async function getSession(app: FastifyInstance){
  app.get('/session', async (req: ReqQueryType, res) =>{

    const parsedReq = ReqQueryParser.parse(req);
    const { code } = parsedReq.query
    console.log(code)
    if(!code) res.redirect('http://localhost:5000/auth/discord')
    const getDiscordSession = new GetDiscordSession

    const session = await getDiscordSession.get(code)

    if(session == -1) res.redirect('http://localhost:5000/auth/discord')
    
    res.send({ session })
  })
}