import { Schema, Document, Types } from 'mongoose';

export interface User extends Document {
  _id: Types.ObjectId;
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
      movieId: { type: Types.ObjectId, ref: 'Movie' },
      rating: { type: Number, min: 1, max: 10 },
    },
  ],
});
