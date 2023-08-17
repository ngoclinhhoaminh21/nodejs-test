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

  static getConverFunctionByUnit(unit: string, type: string) {
    if (!Object.values(Metrix.METRIX_TYPE).includes(type)) {
      throw new Error('incorrect1')
    }

    if (Metrix.METRIX_TYPE.Distance == type && !Object.values(DistanceUnit.DistanceUnitName).includes(unit)) {
      throw new Error('incorrect2')
    }

    if (Metrix.METRIX_TYPE.Temperature == type && !Object.values(TemperatureUnit.TemperatureUnitName).includes(unit)) {
      throw new Error('incorrect3')
    }

    switch (unit) {
      case DistanceUnit.DistanceUnitName.CENTIMETER:
        return ({ Value, Unit: OriginUnit }: { Value: number; Unit: string }) => {
          if (OriginUnit == DistanceUnit.DistanceUnitName.FEET) return { Value: Value * 30.48, Unit: unit }
          if (OriginUnit == DistanceUnit.DistanceUnitName.INCH) return { Value: Value * 2.54, Unit: unit }
          if (OriginUnit == DistanceUnit.DistanceUnitName.METER) return { Value: Value * 100, Unit: unit }
          if (OriginUnit == DistanceUnit.DistanceUnitName.YARD) return { Value: Value * 91.44, Unit: unit }
          return { Value: Value, Unit: unit }
        }

      case DistanceUnit.DistanceUnitName.FEET:
        return ({ Value, Unit: OriginUnit }: { Value: number; Unit: string }) => {
          if (OriginUnit == DistanceUnit.DistanceUnitName.CENTIMETER) return { Value: Value / 30.48, Unit: unit }
          if (OriginUnit == DistanceUnit.DistanceUnitName.INCH) return { Value: Value / 12, Unit: unit }
          if (OriginUnit == DistanceUnit.DistanceUnitName.METER) return { Value: Value / 0.3048, Unit: unit }
          if (OriginUnit == DistanceUnit.DistanceUnitName.YARD) return { Value: Value * 3, Unit: unit }
          return { Value: Value, Unit: unit }
        }
      case DistanceUnit.DistanceUnitName.INCH:
        return ({ Value, Unit: OriginUnit }: { Value: number; Unit: string }) => {
          if (OriginUnit == DistanceUnit.DistanceUnitName.FEET) return { Value: Value * 12, Unit: unit }
          if (OriginUnit == DistanceUnit.DistanceUnitName.CENTIMETER) return { Value: Value / 2.54, Unit: unit }
          if (OriginUnit == DistanceUnit.DistanceUnitName.METER) return { Value: Value / 0.0254, Unit: unit }
          if (OriginUnit == DistanceUnit.DistanceUnitName.YARD) return { Value: Value * 36, Unit: unit }
          return { Value: Value, Unit: unit }
        }
      case DistanceUnit.DistanceUnitName.METER:
        return ({ Value, Unit: OriginUnit }: { Value: number; Unit: string }) => {
          if (OriginUnit == DistanceUnit.DistanceUnitName.FEET) return { Value: Value * 0.3048, Unit: unit }
          if (OriginUnit == DistanceUnit.DistanceUnitName.INCH) return { Value: Value * 0.0254, Unit: unit }
          if (OriginUnit == DistanceUnit.DistanceUnitName.CENTIMETER) return { Value: Value / 100, Unit: unit }
          if (OriginUnit == DistanceUnit.DistanceUnitName.YARD) return { Value: Value * 0.9144, Unit: unit }
          return { Value: Value, Unit: unit }
        }
      case DistanceUnit.DistanceUnitName.YARD:
        return ({ Value, Unit: OriginUnit }: { Value: number; Unit: string }) => {
          if (OriginUnit == DistanceUnit.DistanceUnitName.FEET) return { Value: Value / 3, Unit: unit }
          if (OriginUnit == DistanceUnit.DistanceUnitName.INCH) return { Value: Value / 36, Unit: unit }
          if (OriginUnit == DistanceUnit.DistanceUnitName.METER) return { Value: Value / 0.9144, Unit: unit }
          if (OriginUnit == DistanceUnit.DistanceUnitName.CENTIMETER) return { Value: Value / 91.44, Unit: unit }
          return { Value: Value, Unit: unit }
        }

      case TemperatureUnit.TemperatureUnitName.C:
        return ({ Value, Unit: OriginUnit }: { Value: number; Unit: string }) => {
          if (OriginUnit == TemperatureUnit.TemperatureUnitName.F) return { Value: ((Value - 32) * 5) / 9, Unit: unit }
          if (OriginUnit == TemperatureUnit.TemperatureUnitName.K) return { Value: Value - 273.15, Unit: unit }
          return { Value: Value, Unit: unit }
        }

      case TemperatureUnit.TemperatureUnitName.F:
        return ({ Value, Unit: OriginUnit }: { Value: number; Unit: string }) => {
          if (OriginUnit == TemperatureUnit.TemperatureUnitName.C) return { Value: (Value * 9) / 5 + 32, Unit: unit }
          if (OriginUnit == TemperatureUnit.TemperatureUnitName.K)
            return { Value: (Value * 9) / 5 - 459.67, Unit: unit }
          return { Value: Value, Unit: unit }
        }

      case TemperatureUnit.TemperatureUnitName.K:
        return ({ Value, Unit: OriginUnit }: { Value: number; Unit: string }) => {
          if (OriginUnit == TemperatureUnit.TemperatureUnitName.F)
            return { Value: ((Value + 459.67) * 5) / 9, Unit: unit }
          if (OriginUnit == TemperatureUnit.TemperatureUnitName.C) return { Value: Value + 273.15, Unit: unit }
          return { Value: Value, Unit: unit }
        }

      default:
        throw new Error('incorrect4')
    }
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

  ConvertValue: { Value: number; Unit: string }

  convert(callback: ({ Value, Unit }: { Value: number; Unit: string }) => { Value: number; Unit: string }) {
    this.ConvertValue = callback({
      Value: this.Value,
      Unit: this.distanceUnit?.Name || this.temperatureUnit?.Name || ''
    })
  }
}
