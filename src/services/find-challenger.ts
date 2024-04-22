import { ChallengerRepository } from "../repositories/challengerRepository";
import { Challenger } from "../repositories/schemas/challenger";

export class FindChallenger{
  constructor(private challengerRepository: ChallengerRepository){};

  findByEmail(email: string){
    return this.challengerRepository.findByEmail(email);
  }

  findBySessionId(sessionId: string){
    return this.challengerRepository.findBySessionId(sessionId);
  }
}