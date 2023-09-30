import { Test, TestingModule } from '@nestjs/testing';
import { SongViewsController } from './song-views.controller';

describe('ViewController', () => {
  let controller: SongViewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongViewsController],
    }).compile();

    controller = module.get<SongViewsController>(SongViewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
