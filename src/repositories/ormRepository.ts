import { Repository } from "typeorm";
import { Challenger } from "./schemas/challenger";

export class OrmRepository extends Repository<Challenger>{

  constructor(private datasource: any){
    super(Challenger, datasource.createEntityManager());
  }

  async register(challenger: Partial<Challenger>){
    await this.save(challenger);
  }
}