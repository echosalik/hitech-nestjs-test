import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class Genre {
  @PrimaryKey({ autoincrement: true, hidden: true })
  id!: number;

  @Unique()
  @Property({ length: 100 })
  name!: string;

  constructor(name: string) {
    this.name = name;
  }

  toDTO(): GenreDTO {
    const dto = new GenreDTO();
    dto.name = this.name;
    return dto;
  }
}

export class GenreDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class IGenreRO {
  @ApiProperty()
  total: number;
  @ApiProperty()
  genre: GenreDTO[];
}
