import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { hash } from "bcrypt";
import { ArticleEntity } from "src/article/article.entity";
@Entity({ name: "users" })
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	username: string;

	@Column({ default: "fdsfsdfsdfsdfsdfsdfsdfsdsdfdsfsfdsfdsf" })
	bio: string;

	@Column({ default: "" })
	image: string =
		"https://lh3.googleusercontent.com/proxy/AGxe1nsJs24WYUgCDGglnJzaADeHC0VaA_YxJQW76UUmAzsP_l0Y5PL4y6pVcEAa2ihchYtwlsRoiji9lRzgMxQo4lJ1Y5DvSP1vt4loHPyDuVX-y10";

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
}
