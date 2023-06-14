import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatesActivityLogs1686698190515 implements MigrationInterface {
  name = 'CreatesActivityLogs1686698190515';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "activity_logs" ("id" BIGSERIAL NOT NULL, "user_id" integer NOT NULL, "action" character varying NOT NULL, "details" json NOT NULL, "uuid" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_965bbdf6150354f9dc70730f06c" UNIQUE ("uuid"), CONSTRAINT "PK_f25287b6140c5ba18d38776a796" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_d54f841fa5478e4734590d4403" ON "activity_logs" ("user_id") `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_965bbdf6150354f9dc70730f06" ON "activity_logs" ("uuid") `);
    await queryRunner.query(
      `ALTER TABLE "activity_logs" ADD CONSTRAINT "FK_d54f841fa5478e4734590d44036" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "activity_logs" DROP CONSTRAINT "FK_d54f841fa5478e4734590d44036"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_965bbdf6150354f9dc70730f06"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d54f841fa5478e4734590d4403"`);
    await queryRunner.query(`DROP TABLE "activity_logs"`);
  }
}
