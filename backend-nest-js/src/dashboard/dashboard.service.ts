import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Libro } from '../libros/entities/libro.entity';
import { Resena } from '../resenas/entities/resena.entity';
import { ResenasService } from '../resenas/resenas.service';
import { AfinidadesService } from '../afinidades/afinidades.service';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,
    @InjectRepository(Resena)
    private readonly resenaRepository: Repository<Resena>,
    private readonly resenasService: ResenasService,
    private readonly afinidadesService: AfinidadesService,
  ) {}

  async obtenerEstadisticasAdmin() {
    const totalLectores = await this.userRepository.count({ where: { rol: 'lector' } });
    const totalLibros = await this.libroRepository.count();

    const resultado = await this.resenaRepository
      .createQueryBuilder('resena')
      .select('AVG(resena.calificacion)', 'promedio')
      .getRawOne<{ promedio: string | null }>();

    const promedioRating = resultado?.promedio
      ? Number(Number(resultado.promedio).toFixed(2))
      : 0;

    return {
      totalLectores,
      totalLibros,
      promedioRating,
    };
  }

  async obtenerDashboardLector(usuarioId: number) {
    const misResenas = await this.resenasService.findByUsuario(usuarioId);
    const usuariosAfines = await this.afinidadesService.findAll(usuarioId);

    return {
      misResenas,
      usuariosAfines,
    };
  }
}
