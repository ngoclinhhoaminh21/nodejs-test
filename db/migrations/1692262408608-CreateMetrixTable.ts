import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMetrixTable1692262408608 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE TABLE [dbo].[DistanceUnit]
        (
        [ID] [INT] IDENTITY(1,1) NOT NULL,
        [Name] [VARCHAR](255) NOT NULL,
        CONSTRAINT [PK_DistanceUnit] PRIMARY KEY CLUSTERED ([ID] ASC)
        )
        `
    )

    await queryRunner.query(`
    INSERT INTO dbo.DistanceUnit (Name)
    VALUES
    ('Meter'),
    ('Centimeter'),
    ('inch'),
    ('feet'),
    ('yard')
    `)

    await queryRunner.query(
      `
          CREATE TABLE [dbo].[TemperatureUnit]
          (
          [ID] [INT] IDENTITY(1,1) NOT NULL,
          [name] [VARCHAR](255) NOT NULL,
          CONSTRAINT [PK_TemperatureUnit] PRIMARY KEY CLUSTERED ([ID] ASC)
          )
          `
    )

    await queryRunner.query(`
    INSERT INTO dbo.TemperatureUnit (Name)
    VALUES
    ('C'),
    ('F'),
    ('K')
    `)

    await queryRunner.query(`
        CREATE TABLE [dbo].[Metrix]
        (
        [ID] [INT] IDENTITY(1,1) NOT NULL,
        [Value] [INT] NOT NULL,
        [Type] [VARCHAR](255)  NOT NULL,
        [DistanceUnitID] [INT]  NULL,
        [TemperatureUnitID] [INT]  NULL,
        [CreatedDate]       DATETIME           NOT NULL  CONSTRAINT [DF_Metrix_CreatedDate] DEFAULT GETDATE(),
        CONSTRAINT [PK_Metrix] PRIMARY KEY CLUSTERED ([ID] ASC),
        CONSTRAINT [FK_Metrix_DistanceUnitID] FOREIGN KEY ([DistanceUnitID])  REFERENCES [dbo].[DistanceUnit]([ID]),
        CONSTRAINT [FK_Metrix_TemperatureUnitID] FOREIGN KEY ([TemperatureUnitID])  REFERENCES [dbo].[TemperatureUnit]([ID])
        )
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT 1')
  }
}
