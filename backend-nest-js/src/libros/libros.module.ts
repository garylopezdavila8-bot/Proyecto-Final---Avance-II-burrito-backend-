import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrosService } from './libros.service';
import { LibrosController } from './libros.controller';
import { Libro } from './entities/libro.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Libro]), AuthModule],
  controllers: [LibrosController],
  providers: [LibrosService],
  exports: [LibrosService, TypeOrmModule],
})
export class LibrosModule {}