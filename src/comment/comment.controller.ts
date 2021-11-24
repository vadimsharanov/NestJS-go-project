import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/createComment.dto";

@Controller("articles/:slug")
export class CommentController {
	constructor(private readonly commentService: CommentService) {}
	@Get("comment")
	async getComment() {
		return "in the future there will be all comments list";
	}
	@Post("comments")
	async postComment(@Body("comment") createCommentDto: CreateCommentDto): Promise<any> {
		return await this.commentService.postComment(createCommentDto);
	}
}
