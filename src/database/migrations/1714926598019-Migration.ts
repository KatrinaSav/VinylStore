import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1714926598019 implements MigrationInterface {
  name = 'Migration1714926598019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data" bytea NOT NULL, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vinyl_record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "authorName" character varying NOT NULL, "description" character varying NOT NULL, "price" real NOT NULL, "imageId" uuid, CONSTRAINT "REL_8f663248b1896940cc63ef9300" UNIQUE ("imageId"), CONSTRAINT "PK_78f769a118f86869181a443973f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "birthDate" date, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "avatarId" uuid, CONSTRAINT "REL_58f5c71eaab331645112cf8cfa" UNIQUE ("avatarId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "review" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "comment" character varying NOT NULL, "score" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, "vinylRecordId" uuid, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."log_action_enum" AS ENUM('create', 'update', 'delete')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."log_objecttype_enum" AS ENUM('profile', 'vinyl-record', 'review')`,
    );
    await queryRunner.query(
      `CREATE TABLE "log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" "public"."log_action_enum" NOT NULL, "userId" uuid, "objectType" "public"."log_objecttype_enum" NOT NULL, "objectId" uuid NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("expiredAt" bigint NOT NULL, "id" character varying(255) NOT NULL, "json" text NOT NULL, "destroyedAt" TIMESTAMP, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_28c5d1d16da7908c97c9bc2f74" ON "session" ("expiredAt") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_purchases_vinyl_record" ("userId" uuid NOT NULL, "vinylRecordId" uuid NOT NULL, CONSTRAINT "PK_80b68a9eb1b1019f54a25055243" PRIMARY KEY ("userId", "vinylRecordId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_46d93f57aa334e8b1a1389e7b7" ON "user_purchases_vinyl_record" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a9eff1f03a8dc00e4d2605f23b" ON "user_purchases_vinyl_record" ("vinylRecordId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "vinyl_record" ADD CONSTRAINT "FK_8f663248b1896940cc63ef9300a" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5" FOREIGN KEY ("avatarId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_1e758e3895b930ccf269f30c415" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_6573e6f1d6cb6a7e016752cfa26" FOREIGN KEY ("vinylRecordId") REFERENCES "vinyl_record"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_purchases_vinyl_record" ADD CONSTRAINT "FK_46d93f57aa334e8b1a1389e7b70" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_purchases_vinyl_record" ADD CONSTRAINT "FK_a9eff1f03a8dc00e4d2605f23b9" FOREIGN KEY ("vinylRecordId") REFERENCES "vinyl_record"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_purchases_vinyl_record" DROP CONSTRAINT "FK_a9eff1f03a8dc00e4d2605f23b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_purchases_vinyl_record" DROP CONSTRAINT "FK_46d93f57aa334e8b1a1389e7b70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_6573e6f1d6cb6a7e016752cfa26"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_1e758e3895b930ccf269f30c415"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vinyl_record" DROP CONSTRAINT "FK_8f663248b1896940cc63ef9300a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a9eff1f03a8dc00e4d2605f23b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_46d93f57aa334e8b1a1389e7b7"`,
    );
    await queryRunner.query(`DROP TABLE "user_purchases_vinyl_record"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_28c5d1d16da7908c97c9bc2f74"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "log"`);
    await queryRunner.query(`DROP TYPE "public"."log_objecttype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."log_action_enum"`);
    await queryRunner.query(`DROP TABLE "review"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "vinyl_record"`);
    await queryRunner.query(`DROP TABLE "image"`);
  }
}
