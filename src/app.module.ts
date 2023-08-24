/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MovieController } from './movie/movie.controller';
import { MikroORM } from '@mikro-orm/core';
import { MovieService } from './movie/movie.service';
import { GenreController } from './genre/genre.controller';
import { GenreService } from './genre/genre.service';
import { SearchController } from './search/search.controller';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
  ],
  controllers: [
    AppController,
    MovieController,
    GenreController,
    SearchController,
  ],
  providers: [
    AppService,
    MovieService,
    GenreService,
  ],
})
export class AppModule implements NestModule,OnModuleInit {

  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
  }
  
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
