import { Test, TestingModule } from '@nestjs/testing';
import { ConfigsService } from './configs.service';

describe('ConfigsService', () => {
  let service: ConfigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigsService]
    }).compile();

    service = module.get<ConfigsService>(ConfigsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
