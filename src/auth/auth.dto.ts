import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @MinLength(1)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @MinLength(6)
  password: string;
}
