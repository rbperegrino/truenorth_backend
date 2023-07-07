import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1686915631399 implements MigrationInterface {
    name = 'Migration1686915631399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operation" ALTER COLUMN "type" SET DEFAULT 'addition'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operation" ALTER COLUMN "type" SET DEFAULT 'addition'.public`);
    }

}
