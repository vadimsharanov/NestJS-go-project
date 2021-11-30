import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { User } from "src/user/decorators/user.decorator";
import { UserEntity } from "src/user/entity/user.entity";
import { AuthGuard } from "src/user/guard/auth.guard";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/createComment.dto";
import { AllCommentResponseInterface } from "./types/allComments.response.interface";
import { CommentResponseInterface } from "./types/comment.response.interface";

@Controller("articles/:slug")
export class CommentController {
	constructor(private readonly commentService: CommentService) {}
	@Get("comment")
	async getComment(@Param("slug") slug: string): Promise<AllCommentResponseInterface> {
		const comment = await this.commentService.getComment(slug);
		return comment;
	}
	@Post("comment")
	@UseGuards(AuthGuard)
	async postComment(
		@User() currentUser: UserEntity,
		@Body("comment") createCommentDto: CreateCommentDto,
		@Param("slug") slug: string,
	): Promise<CommentResponseInterface> {
		const comment = await this.commentService.postComment(createCommentDto, currentUser, slug);
		return await this.commentService.buildCommentResponse(comment);
	}

	@Delete("comment/:id")
	@UseGuards(AuthGuard)
	async deleteComment(@User("id") currentUserId: number, @Param("slug") slug: string, @Param("id") commentId: number) {
		console.log(commentId);

		return this.commentService.deleteComment(currentUserId, slug, commentId);
	}
}
