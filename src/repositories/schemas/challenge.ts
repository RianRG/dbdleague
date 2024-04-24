import 'reflect-metadata'

import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Challenger } from './challenger';

interface Settings{
  region?: String;
  onlySameRegion?: boolean;
  onlyRank?: Number[];
}

@Entity()
export class Challenge{
  @PrimaryGeneratedColumn("uuid")
  id: string

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date

  @DeleteDateColumn({ name: 'endedAt' })
  endedAt: Date

  @Column('json', { nullable: false })
  settings: Settings

  @OneToMany(() => Challenger, (challenger) => challenger.challengeIn)
  challengersOn: Challenger[];

  @ManyToOne(() => Challenger, (challenger) => challenger.challengeIn)
  @JoinColumn({ name: 'winnerId' })
  winner: Challenger;

  @ManyToOne(() => Challenger, (challenger) => challenger.challengeIn)
  @JoinColumn({ name: 'looserId' })
  looser: Challenger;

  @Column('varchar', { nullable: false })
  owner: string
}