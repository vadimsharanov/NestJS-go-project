import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { User } from "src/user/decorators/user.decorator";
import { AuthGuard } from "src/user/guard/auth.guard";
import { ProfileService } from "./profile.service";
import { ProfileResponseInterface } from "./types/profileResponse.interface";

@Controller("profiles")
export class ProfilesController {
	constructor(private readonly profileService: ProfileService) {}
	@Get(":username")
	async getProfile(
		@User("id") currentUserId: number,
		@Param("username") profileUsername: string,
	): Promise<ProfileResponseInterface> {
		console.log(currentUserId, profileUsername);

		const profile = await this.profileService.getProfile(currentUserId, profileUsername);
		return this.profileService.buildProfileResponse(profile);
	}

	@Post(":username/follow")
	@UseGuards(AuthGuard)
	async followProfile(
		@User("id") currentUserId: number,
		@Param("username") profileUsername: string,
	): Promise<ProfileResponseInterface> {
		// console.log(currentUserId, profileUsername);
		const profile = await this.profileService.followProfile(currentUserId, profileUsername);
		return this.profileService.buildProfileResponse(profile);
	}

	@Delete(":username/follow")
	@UseGuards(AuthGuard)
	async unFollowProfile(
		@User("id") currentUserId: number,
		@Param("username") profileUsername: string,
	): Promise<ProfileResponseInterface> {
		const profile = await this.profileService.unFollowProfile(currentUserId, profileUsername);
		return this.profileService.buildProfileResponse(profile);
	}
}
