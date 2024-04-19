import { OrmRepository } from "../repositories/challengerRepository";
import { Challenger } from "../repositories/schemas/challenger";

export class FindChallengerByEmail{
  constructor(private ormRepository: OrmRepository){};

  execute(email: string){
    return this.ormRepository.findChallengerByEmail(email);
  }
}