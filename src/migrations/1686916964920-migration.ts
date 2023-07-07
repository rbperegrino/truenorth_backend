import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1686916964920 implements MigrationInterface {
    name = 'Migration1686916964920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "operation" ALTER COLUMN "type" SET DEFAULT 'addition'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operation" ALTER COLUMN "type" SET DEFAULT 'addition'.public`);
        await queryRunner.query(`DROP INDEX "user"@"UQ_78a916df40e02a9deb1c4b75edb" CASCADE`);
    }

}
