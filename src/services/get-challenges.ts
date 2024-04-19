import { Repository } from "typeorm";
import { Challenge } from "../repositories/schemas/challenge";
import { ChallengeRepository } from "../repositories/challengeRepository";

export class GetChallenges{
  constructor(private challengeRepository: ChallengeRepository){};

  execute(){
    return this.challengeRepository.getChallenge()
  }
}