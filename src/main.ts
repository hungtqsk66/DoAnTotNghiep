import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as fs from 'fs';
import {join} from 'path';
import { AppModule } from './app.module';
import { ApiEntryGuard } from './guard/api-entry.guard';
import { ApiKeyService } from './api-key/service/api-key.service';


async function bootstrap() {

  const app = await NestFactory.create(
    AppModule,
  {
    logger: ['error', 'warn'],
  });
  
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  app.use(helmet( {crossOriginResourcePolicy: false}));
  app.use(morgan('combined',{stream:fs.createWriteStream(join(__dirname,'../logs/access.log'), {flags:'a'})}));
  app.use(compression());
  app.useGlobalGuards(new ApiEntryGuard(new Reflector(),app.get(ApiKeyService)));
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  await app.listen(3000)
  console.log(`Server running on port:3000`);
}
bootstrap();
