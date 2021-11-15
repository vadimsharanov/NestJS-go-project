import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUserDto";
import { UserEntity } from "./entity/user.entity";
import { UserResponseInterface } from "./types/userResponseInterface";
import { UserService } from "./user.service";
import { Request } from "express";
import { ExpressRequestInterface } from "src/types/expressRequestInterface";
import { User } from "./decorators/user.decorator";

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
  async currentUser(@User() user: UserEntity, @User('id') currentUserId:number): Promise<UserResponseInterface> {
    console.log(currentUserId);
    

    return this.userService.buildUserResponse(user);
  }
}
