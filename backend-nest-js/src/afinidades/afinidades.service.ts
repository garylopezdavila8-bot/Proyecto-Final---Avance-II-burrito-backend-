import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resena } from '../resenas/entities/resena.entity';
import { User } from '../entities/user.entity';

export interface UsuarioAfin {
  usuarioId: number;
  nombre: string;
  email: string;
  librosEnComun: string[];
  porcentajeAfinidad: number;
}

const UMBRAL_AFINIDAD = 70;

@Injectable()
export class AfinidadesService {
  constructor(
    @InjectRepository(Resena)
    private readonly resenaRepository: Repository<Resena>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create() {
    throw new BadRequestException(
      'Las afinidades se calculan automáticamente a partir de las calificaciones',
    );
  }

  async findAll(usuarioId: number): Promise<UsuarioAfin[]> {
    return this.calcularAfinidades(usuarioId);
  }

  async findOne(usuarioId: number, otroUsuarioId: number): Promise<UsuarioAfin | null> {
    const afinidades = await this.calcularAfinidades(usuarioId);
    return afinidades.find((a) => a.usuarioId === otroUsuarioId) ?? null;
  }

  update() {
    throw new BadRequestException('Las afinidades no pueden modificarse manualmente');
  }

  remove() {
    throw new BadRequestException('Las afinidades no pueden eliminarse manualmente');
  }

  private async calcularAfinidades(usuarioId: number): Promise<UsuarioAfin[]> {
    const resenasUsuario = await this.resenaRepository.find({
      where: { usuarioId },
      relations: { libro: true },
    });

    if (resenasUsuario.length === 0) {
      return [];
    }

    const resenasOtros = await this.resenaRepository.find({
      relations: { usuario: true, libro: true },
    });

    const mapaUsuario = new Map<number, Map<number, number>>();
    const mapaLibros = new Map<number, Map<number, string>>();

    for (const resena of resenasOtros) {
      if (!mapaUsuario.has(resena.usuarioId)) {
        mapaUsuario.set(resena.usuarioId, new Map());
        mapaLibros.set(resena.usuarioId, new Map());
      }
      mapaUsuario.get(resena.usuarioId)!.set(resena.libroId, resena.calificacion);
      mapaLibros.get(resena.usuarioId)!.set(resena.libroId, resena.libro.titulo);
    }

    const ratingsUsuario = mapaUsuario.get(usuarioId);
    if (!ratingsUsuario) {
      return [];
    }

    const resultados: UsuarioAfin[] = [];

    for (const [otroId, ratingsOtro] of mapaUsuario.entries()) {
      if (otroId === usuarioId) {
        continue;
      }

      const librosComunes: number[] = [];
      const ratingsA: number[] = [];
      const ratingsB: number[] = [];

      for (const [libroId, calificacionA] of ratingsUsuario.entries()) {
        const calificacionB = ratingsOtro.get(libroId);
        if (calificacionB !== undefined) {
          librosComunes.push(libroId);
          ratingsA.push(calificacionA);
          ratingsB.push(calificacionB);
        }
      }

      if (librosComunes.length < 2) {
        continue;
      }

      const correlacion = this.calcularCorrelacionPearson(ratingsA, ratingsB);
      const porcentaje = Math.round(((correlacion + 1) / 2) * 100);

      if (porcentaje < UMBRAL_AFINIDAD) {
        continue;
      }

      const otroUsuario = await this.userRepository.findOneBy({ id: otroId });
      if (!otroUsuario) {
        continue;
      }

      const titulosComunes = librosComunes.map(
        (libroId) => mapaLibros.get(otroId)!.get(libroId) ?? 'Libro',
      );

      resultados.push({
        usuarioId: otroId,
        nombre: otroUsuario.nombre,
        email: otroUsuario.email,
        librosEnComun: titulosComunes,
        porcentajeAfinidad: porcentaje,
      });
    }

    return resultados.sort((a, b) => b.porcentajeAfinidad - a.porcentajeAfinidad);
  }

  private calcularCorrelacionPearson(a: number[], b: number[]): number {
    const n = a.length;
    const mediaA = a.reduce((sum, val) => sum + val, 0) / n;
    const mediaB = b.reduce((sum, val) => sum + val, 0) / n;

    let numerador = 0;
    let denomA = 0;
    let denomB = 0;

    for (let i = 0; i < n; i++) {
      const diffA = a[i] - mediaA;
      const diffB = b[i] - mediaB;
      numerador += diffA * diffB;
      denomA += diffA * diffA;
      denomB += diffB * diffB;
    }

    const denominador = Math.sqrt(denomA * denomB);
    if (denominador === 0) {
      return 0;
    }

    return numerador / denominador;
  }
}
