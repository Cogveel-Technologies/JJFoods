import { Test, TestingModule } from '@nestjs/testing';
import { PetPoojaService } from './pet-pooja.service';

describe('PetPoojaService', () => {
  let service: PetPoojaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PetPoojaService],
    }).compile();

    service = module.get<PetPoojaService>(PetPoojaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
