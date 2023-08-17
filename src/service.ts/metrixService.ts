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

  async getMetrixByType(type: string) {
    if (!Object.values(Metrix.METRIX_TYPE).includes(type)) {
      throw new Error('incorrect1')
    }

    return await Metrix.createQueryBuilder()
      .where('Metrix.Type = :type', { type })
      .getMany()
  }

  async getDataForPeriodDate(type: string, dateOptions: { selectedDate?: Date; fromDate?: Date; endDate?: Date }) {
    return await Metrix.createQueryBuilder()
      .where('Metrix.Type = :type', { type })
      .andWhere(
        new Brackets(qb => {
          qb.where('1=1')

          !!dateOptions.selectedDate &&
            qb.orWhere('CAST(Metrix.CreatedDate AS DATE) = :Date', { Date: formatIsoDate(dateOptions.selectedDate) })

          !!dateOptions.fromDate &&
            !!dateOptions.endDate &&
            qb.orWhere('CAST(Metrix.CreatedDate AS DATE) BETWEEN :from AND :end', {
              from: formatIsoDate(dateOptions.fromDate),
              end: formatIsoDate(dateOptions.endDate)
            })
        })
      )
      .getMany()
  }
}

export const metrixService = new MetrixService()
