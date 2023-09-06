import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiEntryGuard } from './guard/api-entry.guard';
import { ApiKeyService } from './api-key/service/api-key.service';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as fs from 'fs';
import {join} from 'path';


async function bootstrap() {



  const app = await NestFactory.create(AppModule,{

    logger: ['error', 'warn'],
  });
  const apiKeyService = app.get(ApiKeyService);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  app.use(helmet());
  app.use(morgan('combined',{stream:fs.createWriteStream(join(__dirname,'../logs/access.log'), {flags:'a'})}));
  app.use(compression());
  app.setGlobalPrefix('api');
  app.useGlobalGuards(new ApiEntryGuard(apiKeyService));
  app.useGlobalPipes(new ValidationPipe());
  console.log(`Server running on port:3000`);
  await app.listen(3000);
}
bootstrap();
