import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1688719031110 implements MigrationInterface {
  name = 'Migration1688719031110';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "record" ADD "name" varchar NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "record" DROP COLUMN "name"`);
  }
}
