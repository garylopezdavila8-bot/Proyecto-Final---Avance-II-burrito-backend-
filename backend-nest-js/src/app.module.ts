import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
  
    ConfigModule.forRoot({ isGlobal: true }), 
    
    TypeOrmModule.forRoot({
      type: 'mysql',
     
      host: process.env.DB_HOST || 'buszufypboro7alzpndb-mysql.services.clever-cloud.com',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      username: process.env.DB_USERNAME || 'buszufypboro7alzpndb',
      password: process.env.DB_PASSWORD || 'gEKWRvfjVEW7kUHhs7on',
      database: process.env.DB_DATABASE || 'uf2kwbduv5yyxuxt',
      entities: [User, Libro, Resena], 
      synchronize: true, 
      
      // Clever Cloud requiere SSL para conexiones externas seguras
      ssl: process.env.DB_HOST && process.env.DB_HOST !== 'buszufypboro7alzpndb-mysql.services.clever-cloud.com' ? {
        rejectUnauthorized: false,
      } : false,
    }),
    AuthModule,
    LibrosModule,
    ResenasModule,
    AfinidadesModule,
    DashboardModule,
  ],
})
export class AppModule {}