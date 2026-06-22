import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { User } from '../entities/user.entity';
import { Libro } from '../libros/entities/libro.entity';
import { Resena } from '../resenas/entities/resena.entity';
import { ResenasModule } from '../resenas/resenas.module';
import { AfinidadesModule } from '../afinidades/afinidades.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Libro, Resena]),
    ResenasModule,
    AfinidadesModule,
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
