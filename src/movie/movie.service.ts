import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CustomException } from 'src/common/filters/custom-exception.filter';
import { Movie } from './schemas/movie.schema';
import { TmdbService } from 'src/tmdb/tmdb.service';
import { RateDto } from './movie.dto';
import { User } from 'src/user/schemas/user.schema';
import { Cache } from 'cache-manager';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel('Movie') private movieModel: Model<Movie>,
    @InjectModel('User') private userModel: Model<User>,
    private tmdbService: TmdbService,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  async getMovies(page: number = 1, pageSize: number = 20): Promise<Movie[]> {
    const cacheKey = `movies_page=${page}`;

    const cachedMovies = await this.cacheManager.get(cacheKey);
    if (cachedMovies) {
      return cachedMovies as Movie[];
    }

    const skip = (page - 1) * pageSize;

    const dbMovies = await this.movieModel
      .find()
      .select('_id title genre ratings')
      .skip(skip)
      .limit(pageSize)
      .exec();

    const dbMovieCount = dbMovies.length;

    if (dbMovieCount < pageSize) {
      const missingCount = pageSize - dbMovieCount;

      const tmdbMovies = await this.tmdbService.fetchMovies(page, missingCount);

      const insertedMovies = await this.insertTmdbMovies(tmdbMovies);

      return [...dbMovies, ...insertedMovies];
    }

    await this.cacheManager.set(cacheKey, dbMovies);

    return dbMovies;
  }

  async rateMovie(rateDto: RateDto, userId: Types.ObjectId): Promise<Movie> {
    const movie = await this.movieModel.findById(rateDto.movie_id).exec();

    if (!movie) {
      throw new CustomException('Movie not found');
    }

    const { count, average } = movie.ratings;

    const updatedCount = count + 1;
    const updatedAverage = (average * count + rateDto.rate) / updatedCount;

    movie.ratings.count = updatedCount;
    movie.ratings.average = updatedAverage;

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new CustomException('User not found');
    }

    const existingRating = user.ratings.find(
      (rating) => String(rating.movieId) === String(movie._id),
    );

    if (existingRating) {
      existingRating.rating = rateDto.rate;
    } else {
      user.ratings.push({
        movieId: movie._id as Types.ObjectId,
        rating: rateDto.rate,
      });
    }

    const [ratedMovie] = await Promise.all([movie.save(), user.save()]);

    return ratedMovie;
  }

  async addToWatchlist(
    movieId: Types.ObjectId,
    userId: string,
  ): Promise<Movie> {
    const movie = await this.movieModel.findById(movieId).exec();
    if (!movie) {
      throw new CustomException('Movie not found');
    }

    const isAlreadyInWatchlist = movie.watchlistedBy.includes(userId);
    if (isAlreadyInWatchlist) {
      throw new CustomException("Movie is already in the user's watchlist");
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new CustomException('User not found');
    }

    if (!user.watchlist.includes(movieId)) {
      movie.watchlistedBy.push(userId);
      user.watchlist.push(movieId);
    } else {
      throw new CustomException("Movie already in the user's watchlist ");
    }

    const [updatedMovie] = await Promise.all([movie.save(), user.save()]);

    return updatedMovie;
  }

  async findByGenre(genre: string, page: number): Promise<Movie[]> {
    const skip = (page - 1) * 20;
    return this.movieModel
      .find({ genre: { $in: [genre] } })
      .skip(skip)
      .limit(20)
      .exec();
  }

  async removeFromWatchlist(movieId: Types.ObjectId, userId: string) {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new CustomException('User not found');
    }

    const movie = await this.movieModel.findById(movieId).exec();
    if (!movie) {
      throw new CustomException('Movie not found');
    }

    const movieIndex = user.watchlist.indexOf(movieId);

    if (movieIndex > -1) {
      user.watchlist.splice(movieIndex, 1);
    } else {
      throw new CustomException('Movie not found in watchlist');
    }

    const userIndex = movie.watchlistedBy.indexOf(userId);

    if (userIndex > -1) {
      movie.watchlistedBy.splice(userIndex, 1);
    }

    const [updatedMovie] = await Promise.all([movie.save(), user.save()]);

    return updatedMovie;
  }

  async insertTmdbMovies(tmdbMovies: any[]): Promise<Movie[]> {
    const newMovies = tmdbMovies.map((movie) => {
      const genreNames = movie.genre_ids.map(
        (id: number) => this.tmdbService.genreMap[id],
      );
      return {
        title: movie.original_title,
        tmdb_id: movie.id.toString(),
        genre: genreNames,
      };
    });

    return this.movieModel.insertMany(newMovies);
  }
}
