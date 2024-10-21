import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { LoginResponseDto } from './auth.response.dto';
import { Types } from 'mongoose';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signUp: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should return a LoginResponseDto on successful sign up', async () => {
      const authDto: AuthDto = {
        username: 'testuser',
        password: 'password123',
      };
      const result: LoginResponseDto = {
        user: {
          _id: new Types.ObjectId('67162183f6da4cb92e89efd7'),
          username: 'testuser',
          watchlist: [],
          ratings: [],
        },
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      };

      mockAuthService.signUp.mockResolvedValue(result);

      expect(await controller.signUp(authDto)).toEqual(result);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(authDto);
    });

    it('should throw an error if sign-up fails', async () => {
      const authDto: AuthDto = {
        username: 'testuser',
        password: 'password123',
      };
      mockAuthService.signUp.mockRejectedValue(
        new Error('Invalid sign-up data'),
      );

      await expect(controller.signUp(authDto)).rejects.toThrow(
        'Invalid sign-up data',
      );
    });
  });

  describe('login', () => {
    it('should return a LoginResponseDto on successful login', async () => {
      const authDto: AuthDto = {
        username: 'testuser',
        password: 'password123',
      };
      const result: LoginResponseDto = {
        user: {
          _id: new Types.ObjectId('67162183f6da4cb92e89efd7'),
          username: 'testuser',
          watchlist: [],
          ratings: [],
        },
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      };

      mockAuthService.login.mockResolvedValue(result);

      expect(await controller.login(authDto)).toEqual(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(authDto);
    });

    it('should throw an error if login fails', async () => {
      const authDto: AuthDto = {
        username: 'testuser',
        password: 'password123',
      };
      mockAuthService.login.mockRejectedValue(
        new Error('Invalid login credentials'),
      );

      await expect(controller.login(authDto)).rejects.toThrow(
        'Invalid login credentials',
      );
    });
  });
});
