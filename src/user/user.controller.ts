import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Authenticate } from 'src/common/guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(Authenticate)
  @Get('current')
  async current(@Req() req: Request) {
    return this.userService.currentUser(req['user']._id);
  }

  @UseGuards(Authenticate)
  @Get('watchlist')
  async getUserWithWatchlist(@Req() req: Request) {
    return this.userService.findUserWithWatchlist(req['user']._id);
  }

  @UseGuards(Authenticate)
  @Get('ratings')
  async getUserWithRatedMovies(@Req() req: Request) {
    return this.userService.findUserWithRatedMovies(req['user']._id);
  }
}
