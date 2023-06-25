import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatesCategoriesTable1687615231165 implements MigrationInterface {
  name = 'CreatesCategoriesTable1687615231165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories" ("uuid" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_a4b5917e7297f757879582e1458" UNIQUE ("uuid"), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "categories"`);
  }
}
