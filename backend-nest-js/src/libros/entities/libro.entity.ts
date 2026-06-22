import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Resena } from '../../resenas/entities/resena.entity';

@Entity('libros')
export class Libro {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column()
  autor!: string;

  @Column()
  editorial!: string;

  @Column()
  genero!: string;

  @Column({ type: 'text' })
  sinopsis!: string;

  @Column({ nullable: true })
  imagenUrl!: string | null;

  @OneToMany(() => Resena, (resena) => resena.libro)
  resenas!: Resena[];
}
