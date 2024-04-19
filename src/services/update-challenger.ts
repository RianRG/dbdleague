import { ChallengerRepository } from "../repositories/challengerRepository";
import { Challenger } from "../repositories/schemas/challenger";

export class UpdateChallenger{
  constructor(private challengerRepository: ChallengerRepository){};

  async execute(challenger: Challenger, updatedChallenger: any){
    await this.challengerRepository.updateChallengeIn(challenger, updatedChallenger);
  }
}