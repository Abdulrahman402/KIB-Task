import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Authenticate } from 'src/common/guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentDto, WatchlistDto, RatingsDto } from './user.response.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(Authenticate)
  @Get('current')
  @ApiOkResponse({
    description: 'Current user retrieved successfully.',
    type: CurrentDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  async current(@Req() req: Request): Promise<CurrentDto> {
    return this.userService.currentUser(req['user']._id);
  }

  @UseGuards(Authenticate)
  @Get('watchlist')
  @ApiOkResponse({
    description: 'User watchlist retrieved successfully.',
    type: WatchlistDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  async getUserWithWatchlist(@Req() req: Request) {
    return this.userService.findUserWithWatchlist(req['user']._id);
  }

  @UseGuards(Authenticate)
  @Get('ratings')
  @ApiOkResponse({
    description: 'User rated movies retrieved successfully.',
    type: [RatingsDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  async getUserWithRatedMovies(@Req() req: Request) {
    return this.userService.findUserWithRatedMovies(req['user']._id);
  }
}
