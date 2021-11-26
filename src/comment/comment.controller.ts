import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { User } from "src/user/decorators/user.decorator";
import { UserEntity } from "src/user/entity/user.entity";
import { AuthGuard } from "src/user/guard/auth.guard";
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
	@UseGuards(AuthGuard)
	async postComment(
		@User() currentUser: UserEntity,
		@Body("comment") createCommentDto: CreateCommentDto,
	): Promise<any> {
		const comment = await this.commentService.postComment(createCommentDto, currentUser);
		return await this.commentService.buildArticleResponse(comment);
	}
}
