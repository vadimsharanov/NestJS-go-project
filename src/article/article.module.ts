import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FollowEntity } from "src/profile/follow.entity";
import { UserEntity } from "src/user/entity/user.entity";
import { ArticleController } from "./article.controller";
import { ArticleEntity } from "./article.entity";
import { ArticleService } from "./article.service";

@Module({
	imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity])],
	controllers: [ArticleController],
	providers: [ArticleService],
})
export class ArticleModule {}
