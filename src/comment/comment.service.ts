import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleEntity } from "src/article/article.entity";
import { UserEntity } from "src/user/entity/user.entity";
import { DeleteResult, getRepository, Repository } from "typeorm";
import { CommentEntity } from "./comment.entity";
import { CreateCommentDto } from "./dto/createComment.dto";
import { AllCommentResponseInterface } from "./types/allComments.response.interface";
import { CommentResponseInterface } from "./types/comment.response.interface";

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>,
		@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
	) {}

	async getComment(param: string): Promise<AllCommentResponseInterface> {
		const queryBuilder = getRepository(CommentEntity)
			.createQueryBuilder("comment")
			.leftJoinAndSelect("comment.author", "author");
		queryBuilder.andWhere("comment.slug = :slug", {
			slug: param,
		});
		const commentsCount = await queryBuilder.getCount();
		const comments = await queryBuilder.getMany();
		return { comments, commentsCount };
	}

	async postComment(createCommentDto: CreateCommentDto, currentUser: UserEntity, slug: string): Promise<CommentEntity> {
		const comment = new CommentEntity();
		const article = await this.findBySlug(slug);
		if (!article) {
			throw new HttpException("Article does not exist!", HttpStatus.UNPROCESSABLE_ENTITY);
		}
		Object.assign(comment, createCommentDto);
		comment.author = currentUser;
		comment.slug = slug;

		return await this.commentRepository.save(comment);
	}

	async deleteComment(currentUserId: number, slug: string, commentId: number): Promise<DeleteResult> {
		const comment = await this.findCommentBySlug(commentId);
		const article = await this.findBySlug(slug);

		if (!article) {
			throw new HttpException("Article does not exist", HttpStatus.NOT_FOUND);
		}

		if (!comment) {
			throw new HttpException("Comment does not exist", HttpStatus.NOT_FOUND);
		}

		if (comment.author.id !== currentUserId) {
			throw new HttpException("You are not an author", HttpStatus.FORBIDDEN);
		}
		return await this.commentRepository.delete(commentId);
	}

	async findBySlug(slug: string): Promise<ArticleEntity> {
		return await this.articleRepository.findOne({ slug });
	}

	async findCommentBySlug(commentId: number) {
		return await this.commentRepository.findOne(commentId);
	}

	buildCommentResponse(comment: CommentEntity): CommentResponseInterface {
		return { comment };
	}
}
