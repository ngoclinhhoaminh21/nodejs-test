import { Brackets, getManager } from 'typeorm'

import { formatIsoDate } from '../../helper'
import { DistanceUnit } from '../entities/DistanceUnit'
import { Metrix } from '../entities/Metrix'
import { TemperatureUnit } from '../entities/TemperatureUnit'

class MetrixService {
  async addMetrix(value: number, type: string, unit: string) {
    const transaction = getManager()

    if (!Object.values(Metrix.METRIX_TYPE).includes(type)) {
      throw new Error('incorrect1')
    }

    if (Metrix.METRIX_TYPE.Distance == type && !Object.values(DistanceUnit.DistanceUnitName).includes(unit)) {
      throw new Error('incorrect2')
    }

    if (Metrix.METRIX_TYPE.Temperature == type && !Object.values(TemperatureUnit.TemperatureUnitName).includes(unit)) {
      throw new Error('incorrect3')
    }

    const unitID =
      Metrix.METRIX_TYPE.Distance == type
        ? (await transaction.getRepository(DistanceUnit).findOneOrFail({ where: { Name: unit } })).ID
        : (await transaction.getRepository(TemperatureUnit).findOneOrFail({ where: { Name: unit } })).ID

    await transaction
      .getRepository(Metrix)
      .create({
        Value: value,
        Type: type,
        DistanceUnitID: Metrix.METRIX_TYPE.Distance == type ? unitID : null,
        TemperatureUnitID: Metrix.METRIX_TYPE.Temperature == type ? unitID : null
      })
      .save()
  }

  async getMetrixByType(type: string, convertTo?: string) {
    if (!Object.values(Metrix.METRIX_TYPE).includes(type)) {
      throw new Error('incorrect1')
    }

    const data = await Metrix.createQueryBuilder()
      .where('Metrix.Type = :type', { type })
      .leftJoinAndSelect('Metrix.temperatureUnit', 'TemperatureUnit')
      .leftJoinAndSelect('Metrix.distanceUnit', 'DistanceUnit')
      .getMany()

    if (!!convertTo) {
      const convertFunction = Metrix.getConverFunctionByUnit(convertTo, type)
      for (const item of data) {
        item.convert(convertFunction)
      }
    }
    return data
  }

  async getDataForPeriodDate(
    type: string,
    dateOptions: { selectedDate?: Date; fromDate?: Date; endDate?: Date },
    convertTo?: string
  ) {
    const data = await Metrix.createQueryBuilder()
      .leftJoinAndSelect('Metrix.temperatureUnit', 'TemperatureUnit')
      .leftJoinAndSelect('Metrix.distanceUnit', 'DistanceUnit')
      .leftJoin(
        qb => {
          return qb
            .subQuery()
            .from(Metrix, 'Metrix')
            .select([
              'Metrix.ID as ID',
              'ROW_NUMBER() OVER (PARTITION BY CAST(Metrix.CreatedDate as date)  ORDER BY Metrix.CreatedDate DESC) as row_number'
            ])
        },
        'TempTable',
        'TempTable.ID = Metrix.ID'
      )
      .where('Metrix.Type = :type', { type })
      .andWhere(
        new Brackets(qb => {
          qb.where('1=1')

          !!dateOptions.fromDate &&
            !!dateOptions.endDate &&
            qb.orWhere('CAST(Metrix.CreatedDate AS DATE) BETWEEN :from AND :end', {
              from: formatIsoDate(dateOptions.fromDate),
              end: formatIsoDate(dateOptions.endDate)
            })
        })
      )
      .andWhere('TempTable.row_number = 1')
      .getMany()

    if (!!convertTo) {
      const convertFunction = Metrix.getConverFunctionByUnit(convertTo, type)
      for (const item of data) {
        item.convert(convertFunction)
      }
    }
    return data
  }
}

export const metrixService = new MetrixService()
