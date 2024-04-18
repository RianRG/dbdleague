import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Challenge } from "./challenge";

@Entity()
export class Challenger{
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: 'nick', nullable: false })
  nick: string

  @Column({ name: 'email', nullable: false })
  email: string

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date

  @Column({ name: 'avatarUrl', nullable: false })
  avatarUrl: string

  @Column({ name: 'rank' })
  rank: Number

  @ManyToOne(() => Challenge, (challenge) => challenge.challengersOn)
  @JoinColumn({ name: 'challengeId' })
  challengeIn: Challenge;
}