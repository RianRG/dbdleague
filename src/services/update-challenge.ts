import { ChallengeRepository } from "../repositories/challengeRepository";
import { Challenge } from "../repositories/schemas/challenge";

export class UpdateChallenge{
  constructor(private challengeRepository: ChallengeRepository){};

  execute(challenge: Challenge, updatedChallenge: Challenge){
   return this.challengeRepository.updateChallenge(challenge, updatedChallenge) 
  }
}