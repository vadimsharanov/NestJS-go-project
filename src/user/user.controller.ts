import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
import { UserEntity } from "./entity/user.entity";
import { UserResponseInterface } from "./types/userResponseInterface";
import { UserService } from "./user.service";
import { Request } from "express";
import { ExpressRequestInterface } from "src/types/expressRequestInterface";
import { User } from "./decorators/user.decorator";
import { AuthGuard } from "./guard/auth.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post("users")
  @UsePipes(new ValidationPipe())
  async createUser(@Body("user") createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post("users/login")
  @UsePipes(new ValidationPipe())
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
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User("id") currentUserId: number,
    @Body("user") updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(currentUserId, updateUserDto);
    return this.userService.buildUserResponse(user);
  }
}
