import { registerAs } from '@nestjs/config';
import { AwsSecretsService } from './aws-secrets.service';

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

/**
 * Gets configuration values from either .env files (local) or AWS Secrets Manager (cloud)
 */
export async function getConfigValues(): Promise<Partial<Configuration>> {
  // When working locally, use local environment in .env file

  const nodeEnv = process.env.NODE_ENV || 'production';
  // console.log(nodeEnv)
  // For local development, use environment variables
  if (nodeEnv === 'local') {
    return {
      port: parseInt(process.env.PORT || '3001', 10),
      nodeEnv: process.env.NODE_ENV || 'local',
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
    };
  }

  // For development and production, use AWS Secrets Manager
  try {
    const awsSecretsService = new AwsSecretsService();
    const secretId = process.env.AWS_SECRET_ID || 'dev-secret-manager-01';
    const secrets = await awsSecretsService.getSecrets(secretId);
    for (const [key, value] of Object.entries(secrets)) {
      process.env[key] = String(value);
    }
    // console.log('Secrets loaded from AWS Secrets Manager', secrets);
    return {
      port: parseInt(process.env.PORT || '3001', 10), // Keep PORT as env var for flexibility
      nodeEnv: secrets.NODE_ENV || 'production',
      frontendUrl: secrets.FRONTEND_URL || '',
      jwt: {
        secret: secrets.JWT_SECRET || '',
        expirationTime: secrets.JWT_EXPIRATION_TIME || '1h',
      },
      database: {
        url: secrets.DATABASE_URL || '',
        replicaUrl: secrets.DATABASE_URL_REPLICA || '',
        autoMigrate: secrets.AUTO_MIGRATE || 'false',
      },
      redis: {
        url: secrets.REDIS_URL || '',
      },
      mail: {
        host: secrets.MAIL_HOST || '',
        port: parseInt(secrets.MAIL_PORT || '465', 10),
        user: secrets.MAIL_USER || '',
        pass: secrets.MAIL_PASS || '',
      },
    };
  } catch (error) {
    console.error('Failed to load configuration from AWS Secrets Manager:', error);
    throw new Error(`Configuration loading failed: ${error.message}`);
  }
}

export default async (): Promise<Configuration> => {

  const config = await getConfigValues();
  console.log('Configuration values retrieved:', config)
  return {
    port: config.port || 3000,
    nodeEnv: config.nodeEnv || 'production',
    frontendUrl: config.frontendUrl || '',
    jwt: {
      secret: config.jwt?.secret || '',
      expirationTime: config.jwt?.expirationTime || '1h',
    },
    database: {
      url: config.database?.url || '',
      replicaUrl: config.database?.replicaUrl || '',
      autoMigrate: config.database?.autoMigrate || 'false',
    },
    redis: {
      url: config.redis?.url || '',
    },
    mail: {
      host: config.mail?.host || '',
      port: config.mail?.port || 465,
      user: config.mail?.user || '',
      pass: config.mail?.pass || '',
    },
  };
};
