import { Schema, Document, Types } from 'mongoose';
import { Movie } from 'src/movie/schemas/movie.schema';

export interface User extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  watchlist: Types.ObjectId[];
  ratings: { movieId: Types.ObjectId | Movie; rating: number }[];
}

export const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  watchlist: [{ type: Types.ObjectId, ref: 'Movie' }],
  ratings: [
    {
      movieId: { type: Types.ObjectId, ref: 'Movie' },
      rating: { type: Number, min: 1, max: 10 },
    },
  ],
});
