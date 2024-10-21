import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class RatingDto {
  @ApiProperty({ description: 'Number of ratings' })
  count: number;

  @ApiProperty({ description: 'Average rating' })
  average: number;
}

export class MoviesDto {
  @ApiProperty({ description: 'Title of the movie' })
  title: string;

  @ApiProperty({ description: 'TMDB ID of the movie' })
  tmdb_id: string;

  @ApiProperty({
    description: 'Genres associated with the movie',
    type: [String],
  })
  genre: string[];

  @ApiProperty({ description: 'Ratings information' })
  ratings: RatingDto;

  @ApiProperty({
    description: 'List of users who have watchlisted the movie',
    type: [String],
  })
  watchlistedBy: string[];

  @ApiProperty({ description: 'Unique identifier for the movie' })
  _id: Types.ObjectId;
}
