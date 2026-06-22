import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Resena } from '../resenas/entities/resena.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150 })
  nombre!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 20, default: 'lector' })
  rol!: string;

  @CreateDateColumn()
  fechaRegistro!: Date;

  @OneToMany(() => Resena, (resena) => resena.usuario)
  resenas!: Resena[];
}
