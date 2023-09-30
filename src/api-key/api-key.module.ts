import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKey,ApiKeySchema } from './schemas/api-key.schema';
import { ApiKeyService } from './service/api-key.service';

@Module({
    imports: [MongooseModule.forFeature([{name: ApiKey.name, schema: ApiKeySchema }])],
    providers: [ApiKeyService]
})
export class ApiKeyModule{};
