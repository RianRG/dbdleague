import { OrmRepository } from "../repositories/ormRepository";
import { Challenger } from "../repositories/schemas/challenger";

export class FindChallengerByEmail{
  constructor(private ormRepository: OrmRepository){};

  execute(email: string){
    return this.ormRepository.findChallengerByEmail(email);
  }
}