import 'reflect-metadata'

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Challenge } from "./challenge";

@Entity()
export class Challenger{
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column(() => String)
  nick: string

  @Column(() => String)
  email: string

  @CreateDateColumn()
  createdAt: Date

  @Column(() => String)
  avatarUrl: string

  @Column(() => Number)
  rank: Number

  @ManyToOne(() => Challenge, (challenge) => challenge.challengersOn)
  @JoinColumn({ name: 'challengeId' })
  challengeIn: Challenge;
}