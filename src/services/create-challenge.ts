import { Repository } from "typeorm";
import { Challenge } from "../repositories/schemas/challenge";
import { ChallengeRepository } from "../repositories/challengeRepository";

export class CreateChallenge{
  constructor(private challengeRepository: ChallengeRepository){};

  execute(challenge: Partial<Challenge>){
    console.log(`chhh::: ${challenge}`)
    return this.challengeRepository.register(challenge);
  }
}