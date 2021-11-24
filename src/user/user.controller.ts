import { Body, Controller, Get, Param, Post, Put, Req, UseGuards, UsePipes } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
import { UserEntity } from "./entity/user.entity";
import { UserResponseInterface } from "./types/userResponseInterface";
import { UserService } from "./user.service";
import { User } from "./decorators/user.decorator";
import { AuthGuard } from "./guard/auth.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { BackendValidationPipe } from "src/shared/pipes/backendValidation.pipe";

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}
	@Post("users")
	@UsePipes(new BackendValidationPipe())
	async createUser(@Body("user") createUserDto: CreateUserDto): Promise<UserResponseInterface> {
		const user = await this.userService.createUser(createUserDto);
		return this.userService.buildUserResponse(user);
	}

	@Post("users/login")
	@UsePipes(new BackendValidationPipe())
	async loginUser(@Body("user") loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
		const user = await this.userService.loginUser(loginUserDto);
		return await this.userService.buildUserResponse(user);
	}

	@Get("user")
	@UseGuards(AuthGuard)
	async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
		return this.userService.buildUserResponse(user);
	}

	@Put("user")
	@UsePipes(new BackendValidationPipe())
	@UseGuards(AuthGuard)
	async updateCurrentUser(
		@User("id") currentUserId: number,
		@Body("user") updateUserDto: UpdateUserDto,
	): Promise<UserResponseInterface> {
		const user = await this.userService.updateUser(currentUserId, updateUserDto);
		return this.userService.buildUserResponse(user);
	}
}
