import { Schema, Document } from 'mongoose';

export interface Movie extends Document {
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
