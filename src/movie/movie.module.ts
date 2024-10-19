import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSchema } from './schemas/movie.schema';
import { TmdbService } from 'src/tmdb/tmdb.service';
import { UserService } from 'src/user/user.service';
import { UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Movie', schema: MovieSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [MovieService, TmdbService, UserService],
  controllers: [MovieController],
})
export class MovieModule {}
