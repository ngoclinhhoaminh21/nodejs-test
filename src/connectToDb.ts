import { Container } from 'typedi'
import * as TypeORM from 'typeorm'
import { ConnectionOptions } from 'typeorm'

import { loadEntitiesAndMigrations } from './../db/entities-migrations-loader'

// register 3rd party IOC container
TypeORM.useContainer(Container)

const DbDevConfig = {
  username: 'sa',
  password: 'Acciona@1234',
  host: 'localhost',
  port: '1433',
  dbname: 'linhnguyen'
}

const getSettings = (): ConnectionOptions => {
  const { port, host, username, password, dbname: database } = DbDevConfig
  return {
    ...loadEntitiesAndMigrations(),
    logger: 'advanced-console',
    logging: 'all',
    type: 'mssql',
    host,
    port: parseInt(port),
    database,
    username,
    password,
    requestTimeout: 900000,
    cli: {
      migrationsDir: 'migrations',
      entitiesDir: 'entities'
    },
    extra: {
      trustServerCertificate: true
    }
  }
}

export const connectToDb = () => {
  return TypeORM.createConnection({
    ...getSettings()
  })
}
