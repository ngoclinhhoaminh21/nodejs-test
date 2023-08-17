import { ConnectionOptions } from 'typeorm'

export type EntitiesAndMigrationsOpts = Pick<ConnectionOptions, 'entities' | 'migrations' | 'subscribers'>

export const loadEntitiesAndMigrations = () => {
  return {
    entities: ['src' + '/entities/*{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}']
  }
}
