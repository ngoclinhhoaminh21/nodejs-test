import { connectToDb } from './src/connectToDb'
import { DistanceUnit } from './src/entities/DistanceUnit'
import { Metrix } from './src/entities/Metrix'
import { metrixService } from './src/service.ts/metrixService'

const main = async () => {
  const connection = await connectToDb()
  try {
    await connection.runMigrations({
      transaction: 'all'
    })
  } catch (err) {
    console.error(err)
  }

  await metrixService.addMetrix(12, Metrix.METRIX_TYPE.Distance, DistanceUnit.DistanceUnitName.CENTIMETER)

  console.log(
    await metrixService.getDataForPeriodDate(
      Metrix.METRIX_TYPE.Distance,
      { selectedDate: new Date() },
      DistanceUnit.DistanceUnitName.METER
    )
  )
}
;(async () => {
  await main()
})()
