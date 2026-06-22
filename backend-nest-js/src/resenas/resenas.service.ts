import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resena } from './entities/resena.entity';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { Libro } from '../libros/entities/libro.entity';

@Injectable()
export class ResenasService {
  constructor(
    @InjectRepository(Resena)
    private readonly resenaRepository: Repository<Resena>,
    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,
  ) {}

  async create(createResenaDto: CreateResenaDto, usuarioId: number): Promise<Resena> {
    const libro = await this.libroRepository.findOneBy({ id: createResenaDto.libroId });
    if (!libro) {
      throw new NotFoundException(`Libro con ID ${createResenaDto.libroId} no encontrado`);
    }

    const resenaExistente = await this.resenaRepository.findOneBy({
      usuarioId,
      libroId: createResenaDto.libroId,
    });

    if (resenaExistente) {
      throw new BadRequestException('Ya has calificado este libro');
    }

    const resena = this.resenaRepository.create({
      ...createResenaDto,
      usuarioId,
    });

    return this.resenaRepository.save(resena);
  }

  async findAll(): Promise<Resena[]> {
    return this.resenaRepository.find({
      relations: { usuario: true, libro: true },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findByLibro(libroId: number): Promise<Resena[]> {
    return this.resenaRepository.find({
      where: { libroId },
      relations: { usuario: true, libro: true },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findByUsuario(usuarioId: number): Promise<Resena[]> {
    return this.resenaRepository.find({
      where: { usuarioId },
      relations: { usuario: true, libro: true },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Resena> {
    const resena = await this.resenaRepository.findOne({
      where: { id },
      relations: { usuario: true, libro: true },
    });

    if (!resena) {
      throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
    }

    return resena;
  }

  async update(
    id: number,
    updateResenaDto: UpdateResenaDto,
    usuarioId: number,
  ): Promise<Resena> {
    const resena = await this.findOne(id);

    if (resena.usuarioId !== usuarioId) {
      throw new ForbiddenException('No puedes modificar reseñas de otros usuarios');
    }

    this.resenaRepository.merge(resena, updateResenaDto);
    return this.resenaRepository.save(resena);
  }

  async remove(id: number, usuarioId: number): Promise<{ message: string }> {
    const resena = await this.findOne(id);

    if (resena.usuarioId !== usuarioId) {
      throw new ForbiddenException('No puedes eliminar reseñas de otros usuarios');
    }

    await this.resenaRepository.remove(resena);
    return { message: 'Reseña eliminada correctamente' };
  }
}
