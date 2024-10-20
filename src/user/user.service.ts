import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './schemas/user.schema';
import { CustomException } from 'src/common/filters/custom-exception.filter';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async currentUser(user_id) {
    const user = await this.userModel.findById(user_id).select('-password');

    if (!user) throw new CustomException('User not found');

    return user;
  }

  async findUserWithWatchlist(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .populate({
        path: 'watchlist',
        select: '_id title genre ratings.average',
      })
      .exec();

    const watchlistWithUserRating = user.watchlist.map((movie: any) => {
      const userRating = user.ratings.find(
        (rating) => rating.movieId.toString() === movie._id.toString(),
      );

      return {
        _id: movie._id,
        title: movie.title,
        genre: movie.genre,
        overallRate: Math.round(movie.ratings.average),
        myRate: userRating ? userRating.rating : null,
      };
    });

    const result = {
      _id: user._id,
      username: user.username,
      watchlist: watchlistWithUserRating,
    };

    return result;
  }

  async findUserWithRatedMovies(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .populate({
        path: 'ratings.movieId',
        select: 'title genre ratings',
      })
      .exec();

    if (!user) {
      throw new CustomException('User not found');
    }

    const ratedMovies = user.ratings.map((rating) => {
      const movie = rating.movieId;
      if (typeof movie !== 'string' && 'title' in movie) {
        return {
          _id: movie._id,
          title: movie.title,
          genre: movie.genre,
          overallRate: Math.round(movie.ratings.average),
          myRate: rating.rating,
        };
      } else {
        return {
          _id: rating.movieId,
          myRate: rating.rating,
        };
      }
    });

    return {
      _id: user._id,
      username: user.username,
      ratedMovies,
    };
  }
}
