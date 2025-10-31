export default () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '9000'),
  cors: {
    origins: process.env.CORS_ORIGINS
      ? (JSON.parse(process.env.CORS_ORIGINS) as string[])
      : [],
    maxAge: parseInt(process.env.CORS_MAX_AGE || String(3 * 60 * 60)),
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  log: {
    levels: process.env.LOG_LEVELS
      ? (JSON.parse(process.env.LOG_LEVELS) as LogLevel[])
      : ['log', 'error', 'warn'],
  },
  auth: {
    maxDelay: parseInt(process.env.AUTH_MAX_DELAY || '5000'),
    hashLength: parseInt(process.env.AUTH_HASH_LENGTH || '32'),
    timeCost: parseInt(process.env.AUTH_HASH_TIME_COST || '6'),
    memoryCost: parseInt(process.env.AUTH_HASH_MEMORY_COST || '65536'),
    jwt: {
      expirationInterval:
        Number(process.env.AUTH_JWT_EXPIRATION_INTERVAL) || 3600,
      secret: process.env.AUTH_JWT_SECRET || '',
      audience: process.env.AUTH_JWT_AUDIENCE || 'budget.hogent.be',
      issuer: process.env.AUTH_JWT_ISSUER || 'budget.hogent.be',
    },
  },
});

export interface ServerConfig {
  env: string;
  port: number;
  cors: CorsConfig;
  database: DatabaseConfig;
  log: LogConfig;
  auth: AuthConfig;
}

export interface CorsConfig {
  origins: string[];
  maxAge: number;
}

export interface DatabaseConfig {
  url: string;
}

export interface LogConfig {
  levels: LogLevel[];
}

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';

export interface JwtConfig {
  expirationInterval: number;
  secret: string;
  audience: string;
  issuer: string;
}

export interface AuthConfig {
  hashLength: number;
  timeCost: number;
  memoryCost: number;
  jwt: JwtConfig;
}
