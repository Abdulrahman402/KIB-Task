import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Request } from 'express';
import { CurrentDto, WatchlistDto, RatingsDto } from './user.response.dto';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    currentUser: jest.fn(),
    findUserWithWatchlist: jest.fn(),
    findUserWithRatedMovies: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        JwtService,
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('current', () => {
    it('should return the current user', async () => {
      const userId = new Types.ObjectId('111111111111111111111111'); // Create ObjectId
      const req = {
        user: { _id: userId }, // Store string representation in req
      } as unknown as Request;

      const result: CurrentDto = {
        _id: userId,
        username: 'testuser',
      };

      mockUserService.currentUser.mockResolvedValue(result);

      expect(await controller.current(req)).toEqual(result);

      // Expect the call to have been made with the ObjectId
      expect(mockUserService.currentUser).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if user not found', async () => {
      const req = {
        user: { _id: '111111111111111111111111' },
      } as unknown as Request;

      mockUserService.currentUser.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(controller.current(req)).rejects.toThrow('User not found');
    });
  });

  describe('getUserWithWatchlist', () => {
    it('should return the user with watchlist', async () => {
      const userId = new Types.ObjectId('111111111111111111111111'); // Create ObjectId
      const req = {
        user: { _id: userId }, // Store string representation in req
      } as unknown as Request;

      const result: WatchlistDto = {
        _id: userId,
        username: 'testuser',
        watchlist: [],
      };

      mockUserService.findUserWithWatchlist.mockResolvedValue(result);

      expect(await controller.getUserWithWatchlist(req)).toEqual(result);
      expect(mockUserService.findUserWithWatchlist).toHaveBeenCalledWith(
        new Types.ObjectId('111111111111111111111111'),
      );
    });

    it('should throw an error if watchlist not found', async () => {
      const userId = new Types.ObjectId('111111111111111111111111'); // Create ObjectId
      const req = {
        user: { _id: userId }, // Store string representation in req
      } as unknown as Request;

      mockUserService.findUserWithWatchlist.mockRejectedValue(
        new Error('Watchlist not found'),
      );

      await expect(controller.getUserWithWatchlist(req)).rejects.toThrow(
        'Watchlist not found',
      );
    });
  });

  describe('getUserWithRatedMovies', () => {
    it('should return the user with rated movies', async () => {
      const userId = new Types.ObjectId('111111111111111111111111'); // Create ObjectId
      const req = {
        user: { _id: userId }, // Store string representation in req
      } as unknown as Request;

      const result: RatingsDto = {
        _id: new Types.ObjectId('111111111111111111111111'),
        username: 'testuser',
        rated_movies: [],
      };

      mockUserService.findUserWithRatedMovies.mockResolvedValue(result);

      expect(await controller.getUserWithRatedMovies(req)).toEqual(result);
      expect(mockUserService.findUserWithRatedMovies).toHaveBeenCalledWith(
        new Types.ObjectId('111111111111111111111111'),
      );
    });

    it('should throw an error if rated movies not found', async () => {
      const userId = new Types.ObjectId('111111111111111111111111'); // Create ObjectId
      const req = {
        user: { _id: userId }, // Store string representation in req
      } as unknown as Request;

      mockUserService.findUserWithRatedMovies.mockRejectedValue(
        new Error('Rated movies not found'),
      );

      await expect(controller.getUserWithRatedMovies(req)).rejects.toThrow(
        'Rated movies not found',
      );
    });
  });
});
