import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Challenger } from './challenger';

enum regionSettings{
  sa = "South America",
  na = "North America",
  eu = "Europe",
  as = "Asia",
}

interface Settings{
  region: regionSettings;
  onlySameRegion: boolean;
  onlyRank: Number;
}

@Entity()
export class Challenge{
  @PrimaryGeneratedColumn("uuid")
  id: string

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date

  @DeleteDateColumn({ name: 'createdAt' })
  endedAt: Date
  

  @Column({ name: 'settings' })
  settings: Settings

  @OneToMany(() => Challenger, (challenger) => challenger.challengeIn)
  challengersOn: Challenger[];

  @ManyToOne(() => Challenger, (challenger) => challenger.challengeIn)
  @JoinColumn({ name: 'winnerId' })
  winner: Challenger;

  @ManyToOne(() => Challenger, (challenger) => challenger.challengeIn)
  @JoinColumn({ name: 'looserId' })
  looser: Challenger;
}