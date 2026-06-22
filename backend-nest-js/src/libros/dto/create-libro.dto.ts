import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLibroDto {
  @ApiProperty({ example: 'Cien años de soledad' })
  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @ApiProperty({ example: 'Gabriel García Márquez' })
  @IsString()
  @IsNotEmpty()
  autor!: string;

  @ApiProperty({ example: 'Sudamericana' })
  @IsString()
  @IsNotEmpty()
  editorial!: string;

  @ApiProperty({ example: 'Realismo mágico' })
  @IsString()
  @IsNotEmpty()
  genero!: string;

  @ApiProperty({ example: 'La historia de la familia Buendía en Macondo.' })
  @IsString()
  @IsNotEmpty()
  sinopsis!: string;
}
