import { Test, TestingModule } from '@nestjs/testing';
import { AfinidadesService } from './afinidades.service';

describe('AfinidadesService', () => {
  let service: AfinidadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AfinidadesService],
    }).compile();

    service = module.get<AfinidadesService>(AfinidadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
