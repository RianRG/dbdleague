import { Repository } from "typeorm";
import { Challenge } from "../repositories/schemas/challenge";
import { ChallengeRepository } from "../repositories/challengeRepository";

export class GetChallenge{
  constructor(private challengeRepository: ChallengeRepository){};

  execute(id: string){
    return this.challengeRepository.getChallengeById(id)
  }
}