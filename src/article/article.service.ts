import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entity/user.entity";
import { DeleteResult, getRepository, Repository } from "typeorm";
import { ArticleEntity } from "./article.entity";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { ArticleResponseInterface } from "./types/article.response.interface";
import slugify from "slugify";
import { AllArticlesResponseInterface } from "./types/allArticlesResponseInterface";
import { User } from "src/user/decorators/user.decorator";
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

		if (query.tag) {
			queryBuilder.andWhere("articles.tagList like :tag", {
				tag: `%${query.tag}%`,
			});
		}

		if (query.author) {
			const author = await this.userRepository.findOne({
				username: query.author,
			});
			queryBuilder.andWhere("articles.authorId = :id", {
				id: author.id,
			});
		}

		if (query.favorited) {
			const author = await this.userRepository.findOne(
				{
					username: query.favorited,
				},
				{ relations: ["favorites"] },
			);

			const ids = author.favorites.map((item) => item.id);
			console.log(ids);

			if (ids.length > 0) {
				queryBuilder.andWhere("articles.authorId IN (:...ids)", { ids });
			} else {
				queryBuilder.andWhere("1=0");
			}
		}
		const articlesCount = await queryBuilder.getCount();
		if (query.limit) {
			queryBuilder.limit(query.limit);
		}

		if (query.offset) {
			queryBuilder.offset(query.offset);
		}

		const articles = await queryBuilder.getMany();
		// console.log(articles);

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

	async addArticleToFavorites(slug: string, currentUserId: number): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug);
		const user = await this.userRepository.findOne(currentUserId, {
			relations: ["favorites"],
		});
		const isNotFavorited =
			user.favorites.findIndex((articleInFavorites) => articleInFavorites.id === article.id) === -1;
		if (isNotFavorited) {
			user.favorites.push(article);
			article.favoritesCount++;
			await this.userRepository.save(user);
			await this.articleRepository.save(article);
		}
		return article;
	}

	async deleteArticleFromFavorites(slug: string, currentUserId: number): Promise<ArticleEntity> {
		const article = await this.findBySlug(slug);
		const user = await this.userRepository.findOne(currentUserId, {
			relations: ["favorites"],
		});
		const articleIndex = user.favorites.findIndex((articleInFavorites) => articleInFavorites.id === article.id);
		if (articleIndex >= 0) {
			user.favorites.splice(articleIndex, 1);
			article.favoritesCount--;
			await this.userRepository.save(user);
			await this.articleRepository.save(article);
		}
		return article;
	}
	buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
		return { article };
	}

	private getSlug(title: string): string {
		return slugify(title, { lower: true }) + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
	}
}
