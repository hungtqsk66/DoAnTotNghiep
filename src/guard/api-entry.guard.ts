import {  CanActivate, ExecutionContext, Inject, Injectable} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ApiKey } from 'src/schemas/api-key.schema';
import { ApiKeyService } from 'src/services/api-key.service';


@Injectable()
export class ApiEntryGuard implements CanActivate {
 
  
  constructor(
    private reflector: Reflector,
    private readonly apiKeyService: ApiKeyService,
  ){}
  
  canActivate(context: ExecutionContext,): Promise<boolean> | boolean | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key']; 
    const allowUnauthorizedRequest = this.reflector.get<boolean>('allowUnauthorizedRequest', context.getHandler());
    if(allowUnauthorizedRequest) return true;
    if (!apiKey) return false;
    return this.validateApiKey(apiKey,'GENERAL');
  }

  async validateApiKey(apiKey: string,permission:string): Promise<boolean> {
    const foundApiKey:ApiKey = await this.apiKeyService.findById(apiKey);
    if(!foundApiKey) return false;
    return foundApiKey?.permissions.includes(permission);	
  }
  
}
