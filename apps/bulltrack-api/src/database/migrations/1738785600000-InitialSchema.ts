import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1738785600000 implements MigrationInterface {
  name = 'InitialSchema1738785600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" varchar NOT NULL,
        "password_hash" varchar NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "bulls" (
        "id" SERIAL NOT NULL,
        "caravana" varchar NOT NULL,
        "nombre" varchar NOT NULL,
        "uso" varchar(20) NOT NULL,
        "origen" varchar(20) NOT NULL,
        "pelaje" varchar(20) NOT NULL,
        "raza" varchar NOT NULL,
        "edad_meses" int NOT NULL,
        "caracteristica_destacada" varchar,
        "stats" jsonb NOT NULL,
        CONSTRAINT "UQ_bulls_caravana" UNIQUE ("caravana"),
        CONSTRAINT "PK_bulls" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "favorites" (
        "user_id" uuid NOT NULL,
        "bull_id" int NOT NULL,
        CONSTRAINT "PK_favorites" PRIMARY KEY ("user_id", "bull_id"),
        CONSTRAINT "FK_favorites_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_favorites_bull" FOREIGN KEY ("bull_id") REFERENCES "bulls"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "favorites"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "bulls"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
