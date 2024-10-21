import { Schema, Document } from 'mongoose';
import { Types } from 'mongoose';

export interface Movie extends Document {
  _id: Types.ObjectId;
  title: string;
  tmdb_id: string;
  genre: string[];
  ratings: { count: number; average: number };
  watchlistedBy: string[];
}

export const MovieSchema = new Schema({
  title: { type: String, required: true },
  tmdb_id: { type: String, required: true },
  genre: [{ type: String }],
  ratings: {
    count: { type: Number, default: 0 },
    average: { type: Number, default: 0 },
  },
  watchlistedBy: [{ type: String, ref: 'User' }],
});
