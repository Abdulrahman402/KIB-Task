import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { MoviesDto } from 'src/movie/movie.response.dto';

export class CurrentDto {
  @ApiProperty({ description: 'Unique identifier for the user' })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Username of the user' })
  username: string;
}

class WatchlistMovieDto {
  @ApiProperty({ description: 'Unique identifier for the movie' })
  _id: string;

  @ApiProperty({ description: 'Title of the movie' })
  title: string;

  @ApiProperty({
    description: 'Genres associated with the movie',
    type: [String],
  })
  genre: string[];

  @ApiProperty({ description: 'Overall average rating of the movie' })
  overallRate: number;

  @ApiProperty({
    description: 'User-specific rating for the movie',
    nullable: true,
  })
  myRate: number | null;
}

export class WatchlistDto {
  @ApiProperty({ description: 'Unique identifier for the user' })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Username of the user' })
  username: string;

  @ApiProperty({
    description: "List of movies in the user's watchlist with ratings",
    type: [WatchlistMovieDto],
  })
  watchlist: WatchlistMovieDto[];
}

class RatedMoviesDto {
  @ApiProperty({ description: 'Unique identifier for the movie' })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Title of the movie' })
  title: string;

  @ApiProperty({
    description: 'Genres associated with the movie',
    type: [String],
  })
  genre?: string[];

  @ApiProperty({ description: 'Overall average rating of the movie' })
  overallRate: number;

  @ApiProperty({ description: 'User-specific rating for the movie' })
  myRate: number;
}

export class RatingsDto {
  @ApiProperty({ description: 'Unique identifier for the user' })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Username of the user' })
  username: string;

  @ApiProperty({
    description: "List of movies in the user's watchlist",
    type: [RatedMoviesDto],
  })
  rated_movies: RatedMoviesDto[];
}
