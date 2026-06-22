import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AfinidadesService } from './afinidades.service';
import { AfinidadesController } from './afinidades.controller';
import { Resena } from '../resenas/entities/resena.entity';
import { User } from '../entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Resena, User]), AuthModule],
  controllers: [AfinidadesController],
  providers: [AfinidadesService],
  exports: [AfinidadesService],
})
export class AfinidadesModule {}
