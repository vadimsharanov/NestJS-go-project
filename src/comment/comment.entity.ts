import { timestamp } from "rxjs";
import { ArticleEntity } from "src/article/article.entity";
import { UserEntity } from "src/user/entity/user.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "comments" })
export class CommentEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	body: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	updatedAt: Date;

	@BeforeUpdate()
	udpateTimeStamp() {
		this.updatedAt = new Date();
	}

	@Column({ default: "" })
	slug: string;

	@ManyToOne(() => UserEntity, (user) => user.comments, { eager: true })
	author: UserEntity;

	@ManyToOne(() => ArticleEntity, (articles) => articles.comment, { eager: true })
	articles: ArticleEntity;
}
