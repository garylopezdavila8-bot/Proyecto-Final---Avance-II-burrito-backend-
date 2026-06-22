import { Test, TestingModule } from '@nestjs/testing';
import { AfinidadesController } from './afinidades.controller';
import { AfinidadesService } from './afinidades.service';

describe('AfinidadesController', () => {
  let controller: AfinidadesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AfinidadesController],
      providers: [AfinidadesService],
    }).compile();

    controller = module.get<AfinidadesController>(AfinidadesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
