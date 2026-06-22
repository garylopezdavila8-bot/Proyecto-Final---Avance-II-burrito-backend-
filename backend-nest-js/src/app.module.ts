import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Libro } from './libros/entities/libro.entity';
import { Resena } from './resenas/entities/resena.entity';
import { AuthModule } from './auth/auth.module';
import { LibrosModule } from './libros/libros.module';
import { ResenasModule } from './resenas/resenas.module';
import { AfinidadesModule } from './afinidades/afinidades.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'zahid8',
      database: 'burrito_lector_db',
      entities: [User, Libro, Resena],
      synchronize: true,
    }),
    AuthModule,
    LibrosModule,
    ResenasModule,
    AfinidadesModule,
    DashboardModule,
  ],
})
export class AppModule {}
