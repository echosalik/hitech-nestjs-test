import { Controller, Get, Query } from '@nestjs/common';
import { IMovieRO, SearchQuery } from '../movie/movie.entity';
import { MovieService } from '../movie/movie.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private movieService: MovieService) {}

  @Get()
  async search(@Query() query: SearchQuery): Promise<IMovieRO> {
    return this.movieService.search(query);
  }
}
