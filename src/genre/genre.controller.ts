import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreDTO, IGenreRO } from './genre.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('genre')
@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  async fetchAll(): Promise<IGenreRO> {
    return await this.genreService.findAll();
  }

  @Post()
  async add(@Body() body: GenreDTO): Promise<GenreDTO> {
    return await this.genreService.add(body);
  }

  @Delete('/:name')
  async delete(@Param('name') name: string) {
    await this.genreService.delete(name);
    return;
  }
}
