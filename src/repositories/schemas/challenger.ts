import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Challenger{
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ name: 'nick' })
  nick: string

  
}