/* eslint-disable prettier/prettier */
import { Migration } from '@mikro-orm/migrations';

export class Migration20230823150904 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `genre` (`id` int unsigned not null auto_increment primary key, `name` varchar(100) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `genre` add unique `genre_name_unique`(`name`);');

    this.addSql('create table `movie` (`id` int unsigned not null auto_increment primary key, `name` varchar(150) not null, `description` text not null, `release_date` date not null, `slug` varchar(50) not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `movie_genres` (`movie_id` int unsigned not null, `genre_id` int unsigned not null, primary key (`movie_id`, `genre_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `movie_genres` add index `movie_genres_movie_id_index`(`movie_id`);');
    this.addSql('alter table `movie_genres` add index `movie_genres_genre_id_index`(`genre_id`);');

    this.addSql('alter table `movie_genres` add constraint `movie_genres_movie_id_foreign` foreign key (`movie_id`) references `movie` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `movie_genres` add constraint `movie_genres_genre_id_foreign` foreign key (`genre_id`) references `genre` (`id`) on update cascade on delete cascade;');
  }

}
