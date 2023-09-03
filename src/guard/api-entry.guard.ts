import {  CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiKey } from 'src/api-key/schemas/api-key.schema';
import { ApiKeyService } from 'src/api-key/service/api-key.service';

@Injectable()
export class ApiEntryGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService){}
 
  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key']; 
    
    if (!apiKey) return false;
    return this.validateApiKey(apiKey,'GENERAL');
  }

  async validateApiKey(apiKey: string,permission:string): Promise<boolean> {
    const foundApiKey:ApiKey = await this.apiKeyService.findById(apiKey);
    if(!foundApiKey) return false;
    return foundApiKey?.permissions.includes(permission);	
  }
  
}
