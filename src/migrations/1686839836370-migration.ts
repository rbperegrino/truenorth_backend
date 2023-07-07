import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1686839836370 implements MigrationInterface {
    name = 'Migration1686839836370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."operation_type_enum" AS ENUM('addition', 'subtraction', 'multiplication', 'division', 'square_root', 'random_string')`);
        await queryRunner.query(`CREATE TABLE "operation" ("id" UUID DEFAULT gen_random_uuid() NOT NULL, "type" "public"."operation_type_enum" NOT NULL DEFAULT 'addition', "cost" int8 NOT NULL, CONSTRAINT "PK_18556ee6e49c005fc108078f3ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "record" ("id" UUID DEFAULT gen_random_uuid() NOT NULL, "operation_id" varchar NOT NULL, "user_id" varchar NOT NULL, "amount" int8 NOT NULL, "user_balance" int8 NOT NULL, "operation_response" varchar NOT NULL, "date" timestamptz NOT NULL DEFAULT now(), "deleted_at" timestamptz, "userId" uuid, CONSTRAINT "PK_5cb1f4d1aff275cf9001f4343b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8675cd3761984947c2506f39a2" ON "record" ("userId") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" UUID DEFAULT gen_random_uuid() NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "status" varchar NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "record" ADD CONSTRAINT "FK_8675cd3761984947c2506f39a25" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record" DROP CONSTRAINT "FK_8675cd3761984947c2506f39a25"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "record"@"IDX_8675cd3761984947c2506f39a2" CASCADE`);
        await queryRunner.query(`DROP TABLE "record"`);
        await queryRunner.query(`DROP TABLE "operation"`);
        await queryRunner.query(`DROP TYPE "public"."operation_type_enum"`);
    }

}
