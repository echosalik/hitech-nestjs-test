import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import axios from 'axios';
import { Genre } from '../genre/genre.entity';
import { Movie } from '../movie/movie.entity';

const requests = axios.create({
  baseURL: 'https://moviesdatabase.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': '9f794e4cd8msh89a1261e8c09f1ep17785fjsnaf39cfebf345',
    'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
  },
});

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager<IDatabaseDriver<Connection>>) {
    const {
      data: { results: genres },
    } = await requests.get('/titles/utils/genres');
    const genreSavable: Genre[] = genres
      .filter((x: any) => x !== null)
      .map((g: string) => {
        return new Genre(g);
      });
    em.upsertMany(genreSavable);
    em.flush();
    for (let i = 1; i < 21; i += 1) {
      const {
        data: { results: movies },
      } = await requests.get('/titles', {
        params: {
          page: i + '',
          limit: '10',
          endYear: '2022',
          startYear: '1990',
          info: 'base_info',
          sort: 'year.decr',
          titleType: 'movie',
        },
      });
      movies
        .filter((x: any) => x !== null)
        .forEach(async (m: any) => {
          const movie = new Movie(
            m.titleText.text,
            m.plot?.plotText?.plainText ?? '',
            new Date(
              m.releaseYear.year,
              m.releaseDate?.month ?? 1,
              m.releaseDate?.day ?? 1,
            ),
          );
          em.persist(movie);
          const genre: Genre[] = m.genres?.genres.map((x: any) =>
            genreSavable.find((g) => g.name === x.text),
          );
          movie.genres.add(genre);
          em.flush();
        });
    }
  }
}
