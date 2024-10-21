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
import { Request } from 'express';
import { MovieService } from './movie.service';
import { RateDto } from './movie.dto';
import { Authenticate } from '../common/guard';
import { CustomException } from '../common/filters/custom-exception.filter';
import { Types } from 'mongoose';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { MoviesDto } from './movie.response.dto';

@ApiTags('Movie')
@ApiBearerAuth()
@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @UseGuards(Authenticate)
  @Get('movies')
  @ApiOkResponse({
    description: 'Retrieved all movies successfully.',
    type: [MoviesDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of movies per page',
  })
  async all(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ): Promise<MoviesDto[]> {
    return this.movieService.getMovies(page, pageSize);
  }

  @UseGuards(Authenticate)
  @Put('rate')
  @ApiOkResponse({ description: 'Movie rated successfully.', type: MoviesDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  @ApiBadRequestResponse({ description: 'Invalid rating data.' })
  async rate(
    @Body() rateDto: RateDto,
    @Req() req: Request,
  ): Promise<MoviesDto> {
    return this.movieService.rateMovie(rateDto, req['user']._id);
  }

  @UseGuards(Authenticate)
  @Put('add-watch-list/movie/:movieId')
  @ApiOkResponse({
    description: 'Movie added to watchlist successfully.',
    type: MoviesDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  @ApiBadRequestResponse({ description: 'Invalid movie ID.' })
  async addToWatchList(
    @Param('movieId') movieId: Types.ObjectId,
    @Req() req: Request,
  ): Promise<MoviesDto> {
    return this.movieService.addToWatchlist(movieId, req['user']._id);
  }

  @UseGuards(Authenticate)
  @Get('filter')
  @ApiOkResponse({
    description: 'Filtered movies retrieved successfully.',
    type: [MoviesDto],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  @ApiBadRequestResponse({ description: 'Genre query parameter is required' })
  @ApiQuery({
    name: 'genre',
    required: true,
    type: String,
    description: 'Genre to filter by',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  async filterByGenre(
    @Query('genre') genre: string,
    @Query('page') page: number = 1,
  ): Promise<MoviesDto[]> {
    if (!genre) {
      throw new CustomException('Genre query parameter is required');
    }

    return this.movieService.findByGenre(genre, page);
  }

  @UseGuards(Authenticate)
  @Put('remove-watch-list/movie/:movieId')
  @ApiOkResponse({
    description: 'Movie removed from watchlist successfully.',
    type: MoviesDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access.' })
  @ApiBadRequestResponse({ description: 'Invalid movie ID.' })
  async removeFromWatchlist(
    @Param('movieId') movieId: Types.ObjectId,
    @Req() req: Request,
  ): Promise<MoviesDto> {
    return this.movieService.removeFromWatchlist(movieId, req['user']._id);
  }
}
