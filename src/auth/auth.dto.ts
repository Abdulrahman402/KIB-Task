import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    description: 'The username of the user',
    maxLength: 15,
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @MinLength(1)
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    maxLength: 15,
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @MinLength(6)
  password: string;
}
