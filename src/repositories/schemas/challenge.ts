import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Challenger } from './challenger';

@Entity()
export class Challenge{
  @PrimaryGeneratedColumn("uuid")
  id: string

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date

  @DeleteDateColumn({ name: 'createdAt' })
  endedAt: Date
  
  @OneToMany(() => Challenger, (challenger) => challenger.challengeIn)
  challengersOn: Challenger[];

  @ManyToOne(() => Challenger, (challenger) => challenger.challengeIn)
  @JoinColumn({ name: 'winnerId' })
  winner: Challenger;

  @ManyToOne(() => Challenger, (challenger) => challenger.challengeIn)
  @JoinColumn({ name: 'looserId' })
  looser: Challenger;
}