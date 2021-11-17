import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entity/user.entity";
import { DeleteResult, getRepository, Repository } from "typeorm";
import { ArticleEntity } from "./article.entity";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { ArticleResponseInterface } from "./types/article.response.interface";
import slugify from "slugify";
import { AllArticlesResponseInterface } from "./types/allArticlesResponseInterface";
@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
	) {}

	async findAll(currentUserId: number, query: any): Promise<AllArticlesResponseInterface> {
		const queryBuilder = getRepository(ArticleEntity)
			.createQueryBuilder("articles")
			.leftJoinAndSelect("articles.author", "author");
		queryBuilder.orderBy("articles.createdAt", "ASC");

		const articlesCount = await queryBuilder.getCount();

		if (query.author) {
			const author = await this.userRepository.findOne({
				username: query.author,
			});
			queryBuilder.andWhere("articles.authorId = :id", {
				id: author.id,
			});
		}

		if (query.limit) {
			queryBuilder.limit(query.limit);
		}

		if (query.offset) {
			queryBuilder.offset(query.offset);
		}

		const articles = await queryBuilder.getMany();

		return { articles, articlesCount };
	}

	async createArticle(currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
		const article = new ArticleEntity();
		Object.assign(article, createArticleDto);

		if (!article.tagList) {
			article.tagList = [];
		}
		article.slug = this.getSlug(createArticleDto.title);
		article.author = currentUser;
		return await this.articleRepository.save(article);
	}

	async findBySlug(slug: string): Promise<ArticleEntity> {
		return await this.articleRepository.findOne({ slug });
	}

	async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
		const article = await this.findBySlug(slug);
		if (!article) {
			throw new HttpException("Article does not exist", HttpStatus.NOT_FOUND);
		}
		if (article.author.id !== currentUserId) {
			throw new HttpException("You are not an author", HttpStatus.FORBIDDEN);
		}
		return await this.articleRepository.delete({ slug });
	}

	async updateArticle(currentUserId: number, createArticleDto: CreateArticleDto, slug: string): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug);
		if (!article) {
			throw new HttpException("Article does not exist", HttpStatus.NOT_FOUND);
		}

		if (article.author.id !== currentUserId) {
			throw new HttpException("You are not an author", HttpStatus.FORBIDDEN);
		}
		Object.assign(article, createArticleDto);
		if (!article.tagList) {
			article.tagList = [];
		}

		return await this.articleRepository.save(article);
	}

	buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
		return { article };
	}

	private getSlug(title: string): string {
		return slugify(title, { lower: true }) + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
	}
}
