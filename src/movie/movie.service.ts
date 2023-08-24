import {
  EntityManager,
  EntityRepository,
  FilterQuery,
  FindOptions,
} from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import {
  IMovieRO,
  Movie,
  MovieDTO,
  SearchField,
  SearchQuery,
} from './movie.entity';
import { Genre } from 'src/genre/genre.entity';
// import { QueryBuilder } from '@mikro-orm/mysql';

@Injectable()
export class MovieService {
  private readonly movieRepository: EntityRepository<Movie>;
  private readonly genreRepository: EntityRepository<Genre>;
  constructor(private readonly em: EntityManager) {
    this.movieRepository = em.getRepository(Movie);
    this.genreRepository = em.getRepository(Genre);
  }

  async findAll(query: any) {
    const options: FindOptions<Movie> = {
      populate: true,
      orderBy: { releaseDate: 'DESC' },
    };
    const count = await this.movieRepository.count();
    if ('limit' in query) {
      options.limit = parseInt(query.limit);
    } else {
      options.limit = 10;
    }
    if ('page' in query) {
      options.offset = (parseInt(query.page) - 1) * options.limit;
    } else {
      query.page = 1;
    }
    const movieData = await this.movieRepository.findAll(options);
    const movie = movieData.map((d) => d.toDTO());
    return {
      page: parseInt(query.page) ?? 1,
      limit: query.limit ?? 10,
      total: count,
      movie,
    } as IMovieRO;
  }

  async findBySlug(slug: string): Promise<MovieDTO> {
    const movie = await this.movieRepository.findOneOrFail(
      { slug: slug },
      { populate: ['genres'] },
    );
    return movie.toDTO();
  }

  async add(dto: MovieDTO): Promise<MovieDTO> {
    const movie = Movie.fromDTO(dto);
    this.em.persistAndFlush(movie);
    const genrePromise = dto.genre.map((x) =>
      this.genreRepository.findOneOrFail({ name: x }),
    );
    const genres = await Promise.all(genrePromise);
    movie.genres.add(genres);
    this.em.persistAndFlush(movie);
    return movie.toDTO();
  }

  async delete(slug: string): Promise<unknown> {
    await this.movieRepository.nativeDelete({ slug: slug });
    return true;
  }

  async update(slug: string, dto: MovieDTO): Promise<MovieDTO> {
    const movie = await this.movieRepository.findOneOrFail(
      { slug: slug },
      { populate: ['genres'] },
    );
    movie.name = dto.name;
    movie.description = dto.description;
    movie.releaseDate = dto.releaseDate;
    await this.em.persistAndFlush(movie);
    movie.genres.removeAll();
    const genrePromise = dto.genre.map((x) =>
      this.genreRepository.findOneOrFail({ name: x }),
    );
    const genres = await Promise.all(genrePromise);
    movie.genres.add(genres);
    this.em.persistAndFlush(movie);
    return movie.toDTO();
  }

  async search(query: SearchQuery) {
    const options: FindOptions<Movie> = {
      populate: true,
      orderBy: { releaseDate: 'DESC' },
    };
    if ('limit' in query) {
      options.limit = parseInt(query.limit);
    } else {
      options.limit = 10;
    }
    if ('page' in query) {
      options.offset = (parseInt(query.page) - 1) * options.limit;
    }
    const filter: FilterQuery<Movie> = {};
    if (query.field === SearchField.Title) {
      filter.name = {
        $like: `%${query.query}%`,
      };
    }
    if (query.field === SearchField.Genre) {
      filter.genres = {
        $in: await this.genreRepository.find({ name: query.query }),
      };
    }
    const count = await this.movieRepository.count(filter);
    const movieData = await this.movieRepository.find(filter, options);
    const movie = movieData.map((d) => d.toDTO());
    return {
      page: parseInt(query.page) ?? 1,
      limit: query.limit ?? 10,
      total: count,
      movie,
    } as IMovieRO;
  }
}
