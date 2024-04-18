import { Repository } from "typeorm";
import { Challenger } from "./schemas/challenger";
import { Challenge } from "./schemas/challenge";

export class OrmRepository extends Repository<Challenger>{
  async register(challenger: Challenge){
    await this.save(challenger);
  }
}