import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { User } from "src/user/decorators/user.decorator";
import { UserEntity } from "src/user/entity/user.entity";
import { AuthGuard } from "src/user/guard/auth.guard";
import { ArticleEntity } from "./article.entity";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { ArticleResponseInterface } from "./types/article.response.interface";

@Controller("articles")
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}
	@Post()
	@UseGuards(AuthGuard)
	async create(
		@User() currentUser: UserEntity,
		@Body("article") createArticleDto: CreateArticleDto,
	): Promise<ArticleResponseInterface> {
		const article = await this.articleService.createArticle(currentUser, createArticleDto);
		return this.articleService.buildArticleResponse(article);
	}
	@Get(":slug")
	async getArticle(@Param("slug") slug: string): Promise<ArticleResponseInterface> {
		const article = await this.articleService.findBySlug(slug);
		return this.articleService.buildArticleResponse(article);
	}

	@Delete(":slug")
	@UseGuards(AuthGuard)
	async deleteSingleArticle(@User("id") currentUserId: number, @Param("slug") slug: string) {
		return await this.articleService.deleteArticle(slug, currentUserId);
	}
}
