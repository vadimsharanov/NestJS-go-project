import { Injectable } from "@nestjs/common";
import { CommentEntity } from "./comment.entity";
import { CreateCommentDto } from "./dto/createComment.dto";

@Injectable()
export class CommentService {
	async postComment(createCommentDto: CreateCommentDto) {
		const comment = new CommentEntity();
		Object.assign(comment, createCommentDto);
		console.log(comment);
	}
}
