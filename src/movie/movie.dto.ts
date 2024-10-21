import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsMongoId,
  Max,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class RateDto {
  @ApiProperty({
    description: 'The ID of the movie being rated',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  movie_id: Types.ObjectId;

  @ApiProperty({
    description: 'The rating given to the movie, between 1 and 10',
    minimum: 1,
    maximum: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @Max(10)
  @Min(1)
  rate: number;
}
