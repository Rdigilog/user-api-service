import { registerAs } from '@nestjs/config';

export interface Configuration {
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  jwt: {
    secret: string;
    expirationTime: string;
  };
  database: {
    url: string;
    replicaUrl: string;
    autoMigrate: string;
  };
  redis: {
    url: string;
  };
  mail: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
}

export default (): Configuration => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || '',
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expirationTime: process.env.JWT_EXPIRATION_TIME || '1h',
  },
  database: {
    url: process.env.DATABASE_URL || '',
    replicaUrl: process.env.DATABASE_URL_REPLICA || '',
    autoMigrate: process.env.AUTO_MIGRATE || 'false',
  },
  redis: {
    url: process.env.REDIS_URL || '',
  },
  mail: {
    host: process.env.MAIL_HOST || '',
    port: parseInt(process.env.MAIL_PORT || '465', 10),
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || '',
  },
});
