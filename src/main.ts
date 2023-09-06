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

  const httpsOptions = {
    key: fs.readFileSync(join(__dirname,'../key.pem')),
    cert: fs.readFileSync(join(__dirname,'../cert.pem')),
  };

  const app = await NestFactory.create(AppModule,{
    httpsOptions,
    logger: ['error', 'warn'],
  });
  const apiKeyService = app.get(ApiKeyService);
  app.use(helmet());
  app.use(morgan('combined',{stream:fs.createWriteStream(join(__dirname,'../logs/access.log'), {flags:'a'})}));
  app.use(compression());
  app.setGlobalPrefix('api');
  app.useGlobalGuards(new ApiEntryGuard(apiKeyService));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
