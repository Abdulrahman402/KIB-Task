import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsMongoId,
  Max,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class RateDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  _id: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  @Max(10)
  @Min(1)
  rate: number;
}
