import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Genre, GenreDTO } from './genre.entity';

@Injectable()
export class GenreService {
  private readonly genreRepository: EntityRepository<Genre>;
  constructor(private readonly em: EntityManager) {
    this.genreRepository = em.getRepository(Genre);
  }

  async findAll() {
    const genre = await this.genreRepository.findAll();
    const count = await this.genreRepository.count();
    return { total: count, genre: genre.map((d) => d.toDTO()) };
  }

  async add(genreDTO: GenreDTO) {
    const genre = new Genre(genreDTO.name);
    await this.em.persistAndFlush(genre);
    return genre.toDTO();
  }

  async delete(name: string) {
    await this.genreRepository.nativeDelete({ name });
    return true;
  }
}
