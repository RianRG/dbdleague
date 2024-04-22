import { Repository } from "typeorm";
import { Challenge } from "./schemas/challenge";

export class ChallengeRepository extends Repository<Challenge>{
  constructor(private datasource: any){
    super(Challenge, datasource.createEntityManager());
  }

  async register(challenge: Partial<Challenge>){
    return await this.save(challenge);
  }

  async getChallenges(){
    return await this.find({
      relations: {
        challengersOn: true
      },
      order: {
        createdAt: 'DESC'
      }
    })
  }

  async getChallengeById(id: string){
    return await this.findOne({
      where: {
        id
      },
      relations: {
        challengersOn: true
      }
    })
  }

  async updateChallenge(challenge: Challenge, updatedChallenge: Challenge){
    this.merge(challenge, updatedChallenge);
    return await this.save(challenge)
  }
}