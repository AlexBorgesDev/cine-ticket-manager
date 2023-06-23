import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatesDirectorsTable1687305106365 implements MigrationInterface {
  name = 'CreatesDirectorsTable1687305106365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "directors" ("uuid" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_b1d8b350d32363b919ec0a3b23a" UNIQUE ("uuid"), CONSTRAINT "PK_a9ae28f00c93801aa034a2c1773" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_405bf12dff92cd37ebbf78bc62" ON "directors" ("name") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_405bf12dff92cd37ebbf78bc62"`);
    await queryRunner.query(`DROP TABLE "directors"`);
  }
}
