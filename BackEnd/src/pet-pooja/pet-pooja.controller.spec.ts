import { Test, TestingModule } from '@nestjs/testing';
import { PetPoojaController } from './pet-pooja.controller';

describe('PetPoojaController', () => {
  let controller: PetPoojaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetPoojaController],
    }).compile();

    controller = module.get<PetPoojaController>(PetPoojaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
