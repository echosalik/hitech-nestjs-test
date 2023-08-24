import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Genre } from '../genre/genre.entity';
import * as slug from 'slug';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';

@Entity()
export class Movie {
  @PrimaryKey({ autoincrement: true, hidden: true })
  id!: number;

  @Property({ length: 150 })
  name!: string;

  @Property({ columnType: 'text', length: 65535 })
  description!: string;

  @Property({ columnType: 'date' })
  releaseDate!: Date;

  @Property({ length: 50 })
  slug!: string;

  @ManyToMany(() => Genre)
  genres = new Collection<Genre>(this);

  constructor(name: string, description: string, releaseDate: Date) {
    this.name = name;
    this.description = description;
    this.releaseDate = releaseDate;
    this.slug = this.createSlug();
  }

  private createSlug(): string {
    return (
      slug(this.name, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    ).slice(0, 140);
  }

  static fromDTO(dto: MovieDTO) {
    return new this(dto.name, dto.description, dto.releaseDate);
  }

  toDTO(): MovieDTO {
    const dto = new MovieDTO();
    dto.name = this.name;
    dto.description = this.description;
    dto.releaseDate = this.releaseDate;
    dto.genre = this.genres.isInitialized()
      ? this.genres.getItems().map((x) => x.name)
      : [];
    return dto;
  }
}

export class MovieDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;
  @ApiProperty()
  @IsISO8601()
  @IsNotEmpty()
  releaseDate!: Date;
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  genre!: string[];
}

export class IMovieRO {
  @ApiResponseProperty()
  page: number;
  @ApiResponseProperty()
  limit: number;
  @ApiResponseProperty()
  total: number;
  @ApiResponseProperty()
  movie: MovieDTO[];
}

export enum SearchField {
  Title = 'title',
  Genre = 'genre',
}

export class SearchQuery {
  @ApiProperty()
  @IsString()
  @IsEnum(SearchField)
  field: SearchField;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  query: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  page?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
