import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenasService } from './resenas.service';
import { ResenasController } from './resenas.controller';
import { Resena } from './entities/resena.entity';
import { Libro } from '../libros/entities/libro.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Resena, Libro]), AuthModule],
  controllers: [ResenasController],
  providers: [ResenasService],
  exports: [ResenasService],
})
export class ResenasModule {}
