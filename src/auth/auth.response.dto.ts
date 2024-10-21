import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Movie } from '../movie/schemas/movie.schema';

export class UserDto {
  @ApiProperty({ description: 'The username of the user' })
  username: string;

  @ApiProperty({ description: 'User watchlist', type: [String] })
  watchlist: Types.ObjectId[];

  @ApiProperty({ description: 'The ID of the user' })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'User ratings', type: [String] })
  ratings: { movieId: Types.ObjectId | Movie; rating: number }[];
}

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refresh_token: string;

  @ApiProperty({ description: 'User details' })
  user: UserDto;
}
