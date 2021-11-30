import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { hash } from "bcrypt";
import { ArticleEntity } from "src/article/article.entity";
import { CommentEntity } from "src/comment/comment.entity";
@Entity({ name: "users" })
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	username: string;

	@Column({ default: "" })
	bio: string;

	@Column({
		default: "https://www.nicepng.com/png/detail/433-4333111_emoji-smile-smiley-badge-round-face-fresh-comments.png",
	})
	image: string;

	@Column({ select: false })
	password: string;

	@BeforeInsert()
	async hashPassword() {
		this.password = await hash(this.password, 10);
	}

	@OneToMany(() => ArticleEntity, (article) => article.author)
	articles: ArticleEntity[];

	@ManyToMany(() => ArticleEntity)
	@JoinTable()
	favorites: ArticleEntity[];

	@OneToMany(() => CommentEntity, (comments) => comments.author)
	comments: CommentEntity[];
}
