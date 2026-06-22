import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../entities/user.entity';
import { Libro } from '../../libros/entities/libro.entity';

@Entity('resenas')
export class Resena {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  calificacion!: number;

  @Column({ type: 'text', nullable: true })
  comentario!: string | null;

  @Column()
  usuarioId!: number;

  @Column()
  libroId!: number;

  @ManyToOne(() => User, (user) => user.resenas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario!: User;

  @ManyToOne(() => Libro, (libro) => libro.resenas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'libroId' })
  libro!: Libro;

  @CreateDateColumn()
  fechaCreacion!: Date;
}
