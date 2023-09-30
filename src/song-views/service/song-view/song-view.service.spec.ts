import { Test, TestingModule } from '@nestjs/testing';
import { SongViewService } from './song-view.service';

describe('SongViewService', () => {
  let service: SongViewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongViewService],
    }).compile();

    service = module.get<SongViewService>(SongViewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
