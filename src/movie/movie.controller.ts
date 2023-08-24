import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { IMovieRO, MovieDTO } from './movie.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('movie')
@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Get()
  async fetchAll(@Query() query: any): Promise<IMovieRO> {
    return await this.movieService.findAll(query);
  }

  @Get('/:slug')
  async fetch(@Param('slug') slug: string): Promise<MovieDTO> {
    return this.movieService.findBySlug(slug);
  }

  @Post('/')
  async add(@Body() movie: MovieDTO): Promise<MovieDTO> {
    return this.movieService.add(movie);
  }

  @Delete('/:slug')
  async delete(@Param('slug') slug: string) {
    await this.movieService.delete(slug);
    return {};
  }

  @Put('/:slug')
  async update(
    @Param('slug') slug: string,
    @Body() body: MovieDTO,
  ): Promise<MovieDTO> {
    return await this.movieService.update(slug, body);
  }
}
