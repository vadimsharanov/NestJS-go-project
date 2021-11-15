import { IsNotEmpty } from "class-validator";

export class UpdateUserDto {
  @IsNotEmpty()
  bio: string;

  @IsNotEmpty()
  image: string;
}
