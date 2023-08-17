import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Metrix } from './Metrix'

@Entity({ name: 'TemperatureUnit' })
@ObjectType()
export class TemperatureUnit extends BaseEntity {
  static TemperatureUnitName = {
    C: 'C',
    K: 'K',
    F: 'F'
  }

  @Field(_type => ID)
  @PrimaryGeneratedColumn()
  ID: number

  @Field(_type => String, { nullable: true })
  @Column()
  Name: string

  @Field(_type => [Metrix], { nullable: true })
  @OneToMany(
    _type => Metrix,
    metrix => metrix.temperatureUnit
  )
  metrixes: Metrix[]
}
