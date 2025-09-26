import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import { DatabaseConfig, ServerConfig } from '../config/configuration';
import { Inject } from '@nestjs/common';

export const DrizzleAsyncProvider = 'DrizzleAsyncProvider';

export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    inject: [ConfigService],
    useFactory: (configService: ConfigService<ServerConfig>) => {
      const databaseConfig = configService.get<DatabaseConfig>('database')!;
      return drizzle({
        client: mysql.createPool({
          uri: databaseConfig.url,
          connectionLimit: 5,
        }),
        mode: 'default',
      });
    },
  },
];

export const InjectDrizzle = () => Inject(DrizzleAsyncProvider);
