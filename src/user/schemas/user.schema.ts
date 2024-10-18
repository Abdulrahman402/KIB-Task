import { Schema, Document } from 'mongoose';

export interface User extends Document {
  username: string;
  password: string;
  watchlist: string[];
  ratings: { movieId: string; rating: number }[];
}

export const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  watchlist: [{ type: String, ref: 'Movie' }],
  ratings: [
    {
      movieId: { type: String, ref: 'Movie' },
      rating: { type: Number, min: 1, max: 10 },
    },
  ],
});
