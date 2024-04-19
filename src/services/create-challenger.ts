import { ChallengerRepository } from "../repositories/challengerRepository";
import { Challenger } from "../repositories/schemas/challenger";

export class CreateChallenger{
  constructor(private challengerRepository: ChallengerRepository){};

  async execute(challenger: Partial<Challenger>){
    await this.challengerRepository.register(challenger);
  }
}