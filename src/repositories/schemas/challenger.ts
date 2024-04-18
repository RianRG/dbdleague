import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Challenge } from "./challenge";

@Entity()
export class Challenger{
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column('varchar', { length: 200, nullable: true })
  nick: string

  @Column('varchar', { length: 200, nullable: true })
  email: string

  @CreateDateColumn()
  createdAt: Date

  @Column('varchar', { length: 200, nullable: true })
  avatarUrl: string

  @Column('integer', { nullable: true })
  rank: Number

  @ManyToOne(() => Challenge, (challenge) => challenge.challengersOn)
  @JoinColumn({ name: 'challengeId' })
  challengeIn: Challenge;
}