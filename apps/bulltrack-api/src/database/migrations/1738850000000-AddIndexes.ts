import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexes1738850000000 implements MigrationInterface {
  name = 'AddIndexes1738850000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_bulls_origen" ON "bulls" ("origen")`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_bulls_uso" ON "bulls" ("uso")`);
    await queryRunner.query(
      `CREATE INDEX "IDX_bulls_pelaje" ON "bulls" ("pelaje")`,
    );

    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
    await queryRunner.query(
      `CREATE INDEX "IDX_bulls_caravana_trgm" ON "bulls" USING gin ("caravana" gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bulls_nombre_trgm" ON "bulls" USING gin ("nombre" gin_trgm_ops)`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_favorites_user_id" ON "favorites" ("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_favorites_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bulls_nombre_trgm"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bulls_caravana_trgm"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bulls_pelaje"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bulls_uso"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bulls_origen"`);
  }
}
