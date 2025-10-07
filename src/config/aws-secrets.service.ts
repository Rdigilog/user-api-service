import { Injectable, Logger } from '@nestjs/common';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export interface AwsSecrets {
  REDIS_URL: string;
  DATABASE_URL: string;
  NODE_ENV: string;
  FRONTEND_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRATION_TIME: string;
  DATABASE_URL_REPLICA: string;
  AUTO_MIGRATE: string;
  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_USER: string;
  MAIL_PASS: string;
}

@Injectable()
export class AwsSecretsService {
  private readonly logger = new Logger(AwsSecretsService.name);
  private secretsClient: SecretsManagerClient;
  private cachedSecrets: AwsSecrets | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.secretsClient = new SecretsManagerClient({
      region: process.env.AWS_REGION || 'eu-west-2',
    });
  }

  async getSecrets(secretId: string): Promise<AwsSecrets> {
    // Check if we have cached secrets that are still valid
    if (this.cachedSecrets && Date.now() < this.cacheExpiry) {
      this.logger.debug('Returning cached secrets');
      return this.cachedSecrets;
    }

    try {
      this.logger.log(`Fetching secrets from AWS Secrets Manager: ${secretId}`);
      
      const command = new GetSecretValueCommand({
        SecretId: secretId,
      });

      const response = await this.secretsClient.send(command);
      
      
      if (!response.SecretString) {
        throw new Error('No secret string found in AWS Secrets Manager response');
      }

      const secrets = JSON.parse(response.SecretString) as AwsSecrets;
      
      // Cache the secrets
      this.cachedSecrets = secrets;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
      
      this.logger.log('Successfully fetched and cached secrets from AWS Secrets Manager');
      return secrets;
    } catch (error) {
      this.logger.error('Failed to fetch secrets from AWS Secrets Manager:', error);
      throw new Error(`Failed to fetch secrets: ${error.message}`);
    }
  }

  /**
   * Clear the cached secrets (useful for testing or when secrets are updated)
   */
  clearCache(): void {
    this.cachedSecrets = null;
    this.cacheExpiry = 0;
    this.logger.debug('Secrets cache cleared');
  }
}
