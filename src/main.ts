import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { ApiEntryGuard } from './guard/api-entry.guard';
import { ApiKeyService } from './api-key/service/api-key.service';


async function bootstrap() {

  const app = await NestFactory.create(
    AppModule,
  {
    logger: ['error', 'warn'],
  });
  
  app.use(helmet( {crossOriginResourcePolicy: false}));
  app.use(compression());
  app.useGlobalGuards(new ApiEntryGuard(new Reflector(),app.get(ApiKeyService)));
  app.setGlobalPrefix('api/audio-server');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000)
  console.log(`Server running on port:4000`);
}
bootstrap();
