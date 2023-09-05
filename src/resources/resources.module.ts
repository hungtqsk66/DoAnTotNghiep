import { Module } from '@nestjs/common';
import { ResourcesController } from './controller/resources/resources.controller';
import { ResourcesService } from './services/resources/resources.service';

@Module({
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourcesModule {}
