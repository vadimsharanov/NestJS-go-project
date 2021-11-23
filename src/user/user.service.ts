import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserEntity } from "./entity/user.entity";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "src/config";
import { UserResponseInterface } from "./types/userResponseInterface";
import { LoginUserDto } from "./dto/loginUser.dto";
import { compare } from "bcrypt";
import { UpdateUserDto } from "./dto/updateUser.dto";

@Injectable()
export class UserService {
	constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

	async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
		const userByEmail = await this.userRepository.findOne({
			email: createUserDto.email,
		});

		const userByUsername = await this.userRepository.findOne({
			username: createUserDto.username,
		});

		if (userByEmail || userByUsername) {
			throw new HttpException("User is already registered", HttpStatus.UNPROCESSABLE_ENTITY);
		}

		const newUser = new UserEntity();
		Object.assign(newUser, createUserDto);
		return await this.userRepository.save(newUser);
	}

	async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
		const loginUser = await this.userRepository.findOne(
			{ email: loginUserDto.email },
			{
				select: ["id", "username", "email", "bio", "image", "password"],
			},
		);
		if (!loginUser) {
			throw new HttpException("Invalid email adress", HttpStatus.UNPROCESSABLE_ENTITY);
		}
		const isPasswordCorrect = await compare(loginUserDto.password, loginUser.password);
		if (!isPasswordCorrect) {
			throw new HttpException("Invalid password", HttpStatus.UNPROCESSABLE_ENTITY);
		}

		delete loginUser.password;

		return loginUser;
	}

	async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
		const user = await this.findByID(userId);
		Object.assign(user, updateUserDto);
		return await this.userRepository.save(user);
	}

	findByID(id: number): Promise<UserEntity> {
		return this.userRepository.findOne(id);
	}

	generateJwt(user: UserEntity): string {
		return sign(
			{
				id: user.id,
				username: user.username,
				email: user.email,
			},
			JWT_SECRET,
		);
	}

	buildUserResponse(user: UserEntity): UserResponseInterface {
		return {
			user: {
				...user,
				token: this.generateJwt(user),
			},
		};
	}
}
