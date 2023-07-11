import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatesFilesTable1688514815407 implements MigrationInterface {
  name = 'CreatesFilesTable1688514815407';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."files_category_enum" AS ENUM('BANNER', 'TRAILER')`);
    await queryRunner.query(
      `CREATE TABLE "files" ("uuid" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" character varying NOT NULL, "id" SERIAL NOT NULL, "bucket" character varying NOT NULL, "category" "public"."files_category_enum" NOT NULL, "filename" character varying NOT NULL, "mimetype" character varying NOT NULL, "size" integer NOT NULL, "alt" character varying, CONSTRAINT "UQ_80216965527c9be0babd7ea5bbe" UNIQUE ("uuid"), CONSTRAINT "UQ_134735cc45672b90b366c20dc35" UNIQUE ("filename"), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_4e6883019e57a8b33052665aa8" ON "files" ("state") `);
    await queryRunner.query(`CREATE INDEX "IDX_2d8e9360c7d44045bb95e588fa" ON "files" ("category") `);
    await queryRunner.query(`CREATE INDEX "IDX_cc51f7f622a90eb63aa676464a" ON "files" ("mimetype") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_cc51f7f622a90eb63aa676464a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2d8e9360c7d44045bb95e588fa"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4e6883019e57a8b33052665aa8"`);
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TYPE "public"."files_category_enum"`);
  }
}
