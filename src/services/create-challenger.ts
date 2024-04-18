import { OrmRepository } from "../repositories/ormRepository";
import { Challenger } from "../repositories/schemas/challenger";

export class CreateChallenger{
  constructor(private ormRepository: OrmRepository){};

  async execute(challenger: Partial<Challenger>){
    await this.ormRepository.register(challenger);
  }
}