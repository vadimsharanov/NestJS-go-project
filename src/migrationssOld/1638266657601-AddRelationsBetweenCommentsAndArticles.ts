import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRelationsBetweenCommentsAndArticles1638266657601 implements MigrationInterface {
    name = 'AddRelationsBetweenCommentsAndArticles1638266657601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "slug" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`COMMENT ON COLUMN "comments"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "comments"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."updatedAt" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "articles"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "comments"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "comments"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "slug"`);
    }

}
