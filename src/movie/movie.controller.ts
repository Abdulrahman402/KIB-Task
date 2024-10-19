import {
  Controller,
  Get,
  Query,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { RateDto } from './movie.dto';
import { Authenticate } from 'src/common/guard';
import { CustomException } from 'src/common/filters/custom-exception.filter';

@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Get('movies')
  @UseGuards(Authenticate)
  async all(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    return this.movieService.getMovies(page, pageSize);
  }

  @Put('rate')
  @UseGuards(Authenticate)
  async rate(@Body() rateDto: RateDto, @Req() req: Request) {
    return this.movieService.rateMovie(rateDto, req['user']._id);
  }

  @Put('add-watch-list/movie/:movieId')
  @UseGuards(Authenticate)
  async addToWatchList(@Param('movieId') movieId: string, @Req() req: Request) {
    return this.movieService.addToWatchlist(movieId, req['user']._id);
  }

  @Get('filter')
  @UseGuards(Authenticate)
  async filterByGenre(
    @Query('genre') genre: string,
    @Query('page') page: number = 1,
  ) {
    if (!genre) {
      throw new CustomException('Genre query parameter is required');
    }

    return this.movieService.findByGenre(genre, page);
  }

  @Put('remove-watch-list/movie/:movieId')
  @UseGuards(Authenticate)
  async removeFromWatchlist(
    @Param('movieId') movieId: string,
    @Req() req: Request,
  ) {
    return this.movieService.removeFromWatchlist(movieId, req['user']._id);
  }
}
