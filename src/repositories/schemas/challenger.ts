import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Challenge } from "./challenge";

@Entity()
export class Challenger{
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column('varchar', { length: 200, nullable: false })
  nick: string

  @Column('varchar', { length: 200, nullable: false })
  email: string

  @CreateDateColumn()
  createdAt: Date

  @Column('varchar', { length: 200, nullable: false })
  avatarUrl: string

  @Column('integer', { nullable: false })
  rank: Number

  @Column('varchar', { length: 200, nullable: false })
  sessionId: string

  @ManyToOne(() => Challenge, (challenge) => challenge.challengersOn)
  @JoinColumn({ name: 'challengeId' })
  challengeIn: Challenge;
}