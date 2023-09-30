import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { ApiEntryGuard } from './guard/api-entry.guard';
import { ApiKeyService } from './api-key/service/api-key.service';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
  {
    logger: ['error', 'warn'],
  });
  
  const configService = app.get(ConfigService);
  const PORT:number = configService.get<number>('AUDIO_SERVER_PORT');

  app.use(helmet( {crossOriginResourcePolicy: false}));
  app.enableCors(
    {
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
    }
  )
  app.use(compression());
  app.useGlobalGuards(new ApiEntryGuard(new Reflector(),app.get(ApiKeyService)));
  app.setGlobalPrefix('api/audio-server');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
  console.log(`Server running on port : ${PORT}`);
}
bootstrap();
