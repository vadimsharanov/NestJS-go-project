import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateRelationsBetweenCommentsAndArticles1637938622608 implements MigrationInterface {
    name = 'CreateRelationsBetweenCommentsAndArticles1637938622608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "articlesId" integer`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "commentId" integer`);
        await queryRunner.query(`COMMENT ON COLUMN "comments"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "comments"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."updatedAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_668588a5dfd429ffed27cdbafcc" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_712708472f44a600c8bf9b7e02e" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_712708472f44a600c8bf9b7e02e"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_668588a5dfd429ffed27cdbafcc"`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "articles"."createdAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "comments"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "comments"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "commentId"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "articlesId"`);
    }

}
