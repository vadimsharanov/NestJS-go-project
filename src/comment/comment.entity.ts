import { timestamp } from "rxjs";
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

	@ManyToOne(() => UserEntity, (user) => user.comments, { eager: true })
	author: UserEntity;
}
