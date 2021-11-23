import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDb1636665481755 implements MigrationInterface {
	name = "SeedDb1636665481755";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`INSERT INTO tags (name) VALUES ('node.js'), ('typescript'), ('nestJS')`);

		// password is "foo"
		await queryRunner.query(
			`INSERT INTO users (username,email,password) VALUES('foo', 'foo@gmail.com', '$2b$10$FNmM5HDZSNgxgKfTl.IPMej5FqRYzpVXtNxhHV7YT7dU8nKlgo4Em') `,
		);
		await queryRunner.query(`INSERT INTO articles
             (slug, title, description, body, "tagList", "authorId")
              VALUES ('first-article', 'first title', 'first description', 'first body', 'nado nado', 1 )`);
	}

	public async down(): Promise<void> {}
}
