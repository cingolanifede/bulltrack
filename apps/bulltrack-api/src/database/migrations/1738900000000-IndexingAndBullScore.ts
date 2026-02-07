import { MigrationInterface, QueryRunner } from 'typeorm';

export class IndexingAndBullScore1738900000000 implements MigrationInterface {
  name = 'IndexingAndBullScore1738900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bulls_caravana_trgm"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bulls_nombre_trgm"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
    await queryRunner.query(
      `CREATE INDEX "IDX_bulls_caravana_trgm" ON "bulls" USING gin (("caravana"::text) gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bulls_nombre_trgm" ON "bulls" USING gin (("nombre"::text) gin_trgm_ops)`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_bulls_filter_combo" ON "bulls" ("origen", "uso", "pelaje")`,
    );

    await queryRunner.query(`
      ALTER TABLE "bulls"
      ADD COLUMN "bull_score" numeric GENERATED ALWAYS AS (
        (stats->>'crecimiento')::numeric * 0.30 +
        (stats->>'facilidad_parto')::numeric * 0.25 +
        (stats->>'reproduccion')::numeric * 0.20 +
        (stats->>'moderacion')::numeric * 0.15 +
        (stats->>'carcasa')::numeric * 0.10
      ) STORED
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_bulls_bull_score" ON "bulls" ("bull_score" DESC)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bulls_bull_score"`);
    await queryRunner.query(
      `ALTER TABLE "bulls" DROP COLUMN IF EXISTS "bull_score"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bulls_filter_combo"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bulls_nombre_trgm"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_bulls_caravana_trgm"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_bulls_caravana_trgm" ON "bulls" USING gin ("caravana" gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bulls_nombre_trgm" ON "bulls" USING gin ("nombre" gin_trgm_ops)`,
    );
  }
}
