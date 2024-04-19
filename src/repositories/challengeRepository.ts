import { Repository } from "typeorm";
import { Challenge } from "./schemas/challenge";

export class ChallengeRepository extends Repository<Challenge>{
  constructor(private datasource: any){
    super(Challenge, datasource.createEntityManager());
  }

  async register(challenge: Partial<Challenge>){
    await this.save(challenge);
  }
}