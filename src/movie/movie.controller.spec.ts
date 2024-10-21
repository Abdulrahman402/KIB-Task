import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { RateDto } from './movie.dto';
import { Request } from 'express';
import { Types } from 'mongoose';
import { MoviesDto } from './movie.response.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CacheModule } from '@nestjs/cache-manager';

describe('MovieController', () => {
  let controller: MovieController;
  let service: MovieService;

  const mockMovieService = {
    getMovies: jest.fn(),
    rateMovie: jest.fn(),
    addToWatchlist: jest.fn(),
    findByGenre: jest.fn(),
    removeFromWatchlist: jest.fn(),
  };

  const mockUserService = {
    currentUser: jest.fn(),
    findUserWithWatchlist: jest.fn(),
    findUserWithRatedMovies: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        { provide: MovieService, useValue: mockMovieService },
        { provide: UserService, useValue: mockUserService },
        JwtService,
      ],
      imports: [CacheModule.register()],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('all', () => {
    it('should return all movies', async () => {
      const result: MoviesDto[] = [
        {
          _id: new Types.ObjectId(),
          title: 'Movie 1',
          tmdb_id: '123',
          genre: ['Action'],
          ratings: { count: 5, average: 7 },
          watchlistedBy: [],
        },
      ];

      mockMovieService.getMovies.mockResolvedValue(result);

      expect(await controller.all(1, 20)).toEqual(result);
      expect(mockMovieService.getMovies).toHaveBeenCalledWith(1, 20);
    });

    it('should return empty array if no movies found', async () => {
      mockMovieService.getMovies.mockResolvedValue([]);

      expect(await controller.all(1, 20)).toEqual([]);
      expect(mockMovieService.getMovies).toHaveBeenCalledWith(1, 20);
    });
  });

  describe('rate', () => {
    it('should rate a movie successfully', async () => {
      const rateDto: RateDto = {
        movie_id: new Types.ObjectId(),
        rate: 8,
      };
      const req = { user: { _id: '1' } } as unknown as Request;

      const result: MoviesDto = {
        _id: rateDto.movie_id,
        title: 'Movie 1',
        tmdb_id: '123',
        genre: ['Action'],
        ratings: { count: 1, average: 8 },
        watchlistedBy: [],
      };

      mockMovieService.rateMovie.mockResolvedValue(result);

      expect(await controller.rate(rateDto, req)).toEqual(result);
      expect(mockMovieService.rateMovie).toHaveBeenCalledWith(
        rateDto,
        req.user._id,
      );
    });
  });

  describe('addToWatchList', () => {
    it('should add a movie to the watchlist successfully', async () => {
      const req = { user: { _id: '1' } } as unknown as Request;
      const movieId = new Types.ObjectId();

      const result: MoviesDto = {
        _id: movieId,
        title: 'Movie 1',
        tmdb_id: '123',
        genre: ['Action'],
        ratings: { count: 0, average: 0 },
        watchlistedBy: [req.user._id.toString()],
      };

      mockMovieService.addToWatchlist.mockResolvedValue(result);

      expect(await controller.addToWatchList(movieId, req)).toEqual(result);
      expect(mockMovieService.addToWatchlist).toHaveBeenCalledWith(
        movieId,
        req.user._id,
      );
    });
  });

  describe('filterByGenre', () => {
    it('should return filtered movies successfully', async () => {
      const genre = 'Action';
      const result: MoviesDto[] = [
        {
          _id: new Types.ObjectId(),
          title: 'Movie 1',
          tmdb_id: '123',
          genre: [genre],
          ratings: { count: 1, average: 8 },
          watchlistedBy: [],
        },
      ];

      mockMovieService.findByGenre.mockResolvedValue(result);

      expect(await controller.filterByGenre(genre, 1)).toEqual(result);
      expect(mockMovieService.findByGenre).toHaveBeenCalledWith(genre, 1);
    });
  });

  describe('removeFromWatchlist', () => {
    it('should remove a movie from the watchlist successfully', async () => {
      const req = { user: { _id: '1' } } as unknown as Request;
      const movieId = new Types.ObjectId();

      const result: MoviesDto = {
        _id: movieId,
        title: 'Movie 1',
        tmdb_id: '123',
        genre: ['Action'],
        ratings: { count: 0, average: 0 },
        watchlistedBy: [],
      };

      mockMovieService.removeFromWatchlist.mockResolvedValue(result);

      expect(await controller.removeFromWatchlist(movieId, req)).toEqual(
        result,
      );
      expect(mockMovieService.removeFromWatchlist).toHaveBeenCalledWith(
        movieId,
        req.user._id,
      );
    });
  });
});
