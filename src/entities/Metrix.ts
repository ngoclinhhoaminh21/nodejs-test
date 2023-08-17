import { Field, ID, Int, ObjectType } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { DistanceUnit } from './DistanceUnit'
import { TemperatureUnit } from './TemperatureUnit'

@Entity({ name: 'Metrix' })
@ObjectType()
export class Metrix extends BaseEntity {
  static METRIX_TYPE = {
    Distance: 'Distance',
    Temperature: 'Temperature'
  }

  @Field(_type => ID)
  @PrimaryGeneratedColumn()
  ID: number

  @Field(_type => Int, { nullable: true })
  @Column()
  Value: number

  @Field(_type => String, { nullable: true })
  @Column()
  Type: string

  @Field(_type => ID, { nullable: true })
  @Column({ nullable: true })
  DistanceUnitID: number | null

  @Field(_type => ID, { nullable: true })
  @Column({ nullable: true })
  TemperatureUnitID: number | null

  @ManyToOne(
    _type => TemperatureUnit,
    temperatureUnit => temperatureUnit.metrixes,
    { nullable: true }
  )
  @JoinColumn({ name: 'TemperatureUnitID' })
  temperatureUnit: TemperatureUnit | null

  @ManyToOne(
    _type => DistanceUnit,
    distanceUnit => distanceUnit.metrixes,
    { nullable: true }
  )
  @JoinColumn({ name: 'DistanceUnitID' })
  distanceUnit: DistanceUnit | null

  @Field()
  @CreateDateColumn({ name: 'CreatedDate' })
  CreatedDate: Date
}
