export interface ConfigType {
  PORT: number;
  DATABASE_TYPE: string;
  MYSQL_HOST: string;
  MYSQL_PORT: number;
  MYSQL_ROOT_PASSWORD: string;
  MYSQL_DATABASE: string;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
}
