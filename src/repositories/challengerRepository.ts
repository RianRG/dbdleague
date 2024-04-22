import { Repository } from "typeorm";
import { Challenger } from "./schemas/challenger";

export class ChallengerRepository extends Repository<Challenger>{

  constructor(private datasource: any){
    super(Challenger, datasource.createEntityManager());
  }

  async register(challenger: Partial<Challenger>){
    await this.save(challenger);
  }

  async findByEmail(email: string){
    return await this.findOne({
      where: {
        email
      },
      relations: {
        challengeIn: true
      }
    })
  }

  async findBySessionId(sessionId: string){
    return await this.findOne({
      where: {
        sessionId
      }
    })
  }

  async updateChallengeIn(challenger: Challenger, updatedChallenger: Partial<Challenger>){
    this.merge(challenger, updatedChallenger)

    return await this.save(challenger);
  }
}