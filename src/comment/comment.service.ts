import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleEntity } from "src/article/article.entity";
import { UserEntity } from "src/user/entity/user.entity";
import { Repository } from "typeorm";
import { CommentEntity } from "./comment.entity";
import { CreateCommentDto } from "./dto/createComment.dto";
import { CommentResponseInterface } from "./types/comment.response.interface";

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>,
		@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
	) {}
	async postComment(createCommentDto: CreateCommentDto, currentUser: UserEntity, slug: string): Promise<CommentEntity> {
		const comment = new CommentEntity();
		const article = await this.findBySlug(slug);
		if (!article) {
			throw new HttpException("Article does not exist!", HttpStatus.UNPROCESSABLE_ENTITY);
		}
		Object.assign(comment, createCommentDto);
		comment.author = currentUser;
		comment.articles = article;
		console.log(currentUser);

		return await this.commentRepository.save(comment);
	}

	async findBySlug(slug: string): Promise<ArticleEntity> {
		return await this.articleRepository.findOne({ slug });
	}

	buildArticleResponse(comment: CommentEntity): CommentResponseInterface {
		return { comment };
	}
}
