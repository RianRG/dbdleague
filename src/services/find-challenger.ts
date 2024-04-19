import { ChallengerRepository } from "../repositories/challengerRepository";
import { Challenger } from "../repositories/schemas/challenger";

export class FindChallengerByEmail{
  constructor(private challengerRepository: ChallengerRepository){};

  execute(email: string){
    return this.challengerRepository.findChallengerByEmail(email);
  }
}