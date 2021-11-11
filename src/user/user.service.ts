import { Get, Injectable, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
  async createUser(createUserDto: CreateUserDto) {
    return createUserDto;
  }
}
