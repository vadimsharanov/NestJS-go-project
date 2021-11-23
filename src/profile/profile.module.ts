import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entity/user.entity";
import { ProfilesController } from "./profile.controller";
import { ProfileService } from "./profile.service";

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	controllers: [ProfilesController],
	providers: [ProfileService],
})
export class ProfileModule {}
