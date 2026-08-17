export default (): ServerConfig => ({
  env: process.env.NODE_ENV || '',
  port: parseInt(process.env.PORT || '3000'),
});

export interface ServerConfig {
  env: string;
  port: number;
}
