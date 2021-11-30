import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFavoritesRelationsBetweenArticleAndUser1637668748812 implements MigrationInterface {
    name = 'AddFavoritesRelationsBetweenArticleAndUser1637668748812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "articles"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."updatedAt" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "articles"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."createdAt" IS NULL`);
    }

}
