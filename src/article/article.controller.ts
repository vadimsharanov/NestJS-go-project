import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { User } from "src/user/decorators/user.decorator";
import { UserEntity } from "src/user/entity/user.entity";
import { AuthGuard } from "src/user/guard/auth.guard";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/createArticle.dto";

@Controller("articles")
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}
	@Post()
	@UseGuards(AuthGuard)
	async create(@User() currentUser: UserEntity, @Body("article") createArticleDto: CreateArticleDto): Promise<any> {
		return this.articleService.createArticle(currentUser, createArticleDto);
	}
}
