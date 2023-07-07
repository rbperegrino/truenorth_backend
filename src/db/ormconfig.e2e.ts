import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmE2eConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const configService = new ConfigService();

    return {
      type: configService.get<any>('TYPEORM_CONNECTION', 'cockroachdb'),
      url: configService.get<string>('TYPEORM_E2E_URL', 'cockroachdb'),
      ssl: true,
      synchronize: true,
      autoLoadEntities: true,
    };
  }
}
