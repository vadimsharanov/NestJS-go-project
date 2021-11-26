import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entity/user.entity";
import { Repository } from "typeorm";
import { CommentEntity } from "./comment.entity";
import { CreateCommentDto } from "./dto/createComment.dto";
import { CommentResponseInterface } from "./types/comment.response.interface";

@Injectable()
export class CommentService {
	constructor(@InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>) {}
	async postComment(createCommentDto: CreateCommentDto, currentUser: UserEntity): Promise<CommentEntity> {
		const comment = new CommentEntity();
		Object.assign(comment, createCommentDto);
		comment.author = currentUser;
		return await this.commentRepository.save(comment);
	}

	buildArticleResponse(comment: CommentEntity): CommentResponseInterface {
		return { comment };
	}
}
