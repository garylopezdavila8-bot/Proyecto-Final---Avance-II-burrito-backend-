import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './entities/libro.entity';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,
  ) {}

  async create(createLibroDto: CreateLibroDto, imagenUrl?: string): Promise<Libro> {
    const nuevoLibro = this.libroRepository.create({
      ...createLibroDto,
      imagenUrl,
    });
    return await this.libroRepository.save(nuevoLibro);
  }

  async findAll(): Promise<Libro[]> {
    return await this.libroRepository.find();
  }

  async findOne(id: number): Promise<Libro> {
    const libro = await this.libroRepository.findOneBy({ id });
    if (!libro) {
      throw new NotFoundException(`Libro con ID ${id} no encontrado`);
    }
    return libro;
  }

  async update(id: number, updateLibroDto: UpdateLibroDto, imagenUrl?: string): Promise<Libro> {
    const libro = await this.findOne(id);
    
    const datosActualizados = { ...updateLibroDto };
    if (imagenUrl) {
      datosActualizados['imagenUrl'] = imagenUrl;
    }

    this.libroRepository.merge(libro, datosActualizados);
    return await this.libroRepository.save(libro);
  }

  async remove(id: number): Promise<void> {
    const libro = await this.findOne(id);
    await this.libroRepository.remove(libro);
  }
}