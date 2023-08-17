import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Metrix } from './Metrix'

@Entity({ name: 'DistanceUnit' })
@ObjectType()
export class DistanceUnit extends BaseEntity {
  static DistanceUnitName = {
    METER: 'Meter',
    CENTIMETER: 'Centimeter',
    INCH: 'inch',
    FEET: 'feet',
    YARD: 'yard'
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
    metrix => metrix.distanceUnit
  )
  metrixes: Metrix[]
}
