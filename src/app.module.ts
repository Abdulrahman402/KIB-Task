import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './movie/movie.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [UserModule, AuthModule, MovieModule, CacheModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
