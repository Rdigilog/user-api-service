import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { readReplicas } from '@prisma/extension-read-replicas';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from './config.keys';
import { exec } from 'child_process';
import { promisify } from 'util';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  private readonly execAsync = promisify(exec);
  private static migrationRun = false;

  constructor(private configService?: ConfigService) {
    super({
      // log: ['query', 'info', 'warn', 'error'], // Logs various levels, including SQL queries
    });
  }

  async onModuleInit() {
    // Connect to database
    await this.$connect();

    // Setup read replicas if configured
    if (this.configService) {
      this.$extends(
        readReplicas({
          url: [
            this.configService.get<string>(CONFIG_KEYS.DATABASE_REPLICA_URL) ||
              '',
          ],
        }),
      );
    }

    // Run migrations after connection is established
    await this.runMigrations();

    this.logger.log('Prisma service initialized successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async models() {
    return Object.keys(Prisma.ModelName);
  }

  /**
   * Safely run database migrations
   * Only runs when explicitly enabled via AUTO_MIGRATE config
   */
  private async runMigrations(): Promise<void> {
    // Prevent multiple migration runs
    if (PrismaService.migrationRun) {
      this.logger.log('Migration already run, skipping...');
      return;
    }

    const environment =
      this.configService?.get<string>(CONFIG_KEYS.NODE_ENV) || 'development';
    const autoMigrate =
      this.configService?.get<string>(CONFIG_KEYS.AUTO_MIGRATE) || 'false';

    // Only run migrations when explicitly enabled
    const shouldRunMigrations = autoMigrate === 'true';

    if (!shouldRunMigrations) {
      this.logger.log(
        `Skipping auto migration - AUTO_MIGRATE is set to '${autoMigrate}'`,
      );
      return;
    }

    // Mark migration as run
    PrismaService.migrationRun = true;

    this.logger.log(
      `Starting database migration in ${environment} environment...`,
    );

    try {
      // Use prisma migrate deploy for production-safe migrations
      const { stdout, stderr } = await this.execAsync('prisma migrate deploy');

      // Log stderr output for debugging (Prisma often outputs info to stderr)
      if (stderr && stderr.trim()) {
        this.logger.debug('Migration stderr (informational):', stderr.trim());
      }

      this.logger.log('✅ Database migration completed successfully');
      if (stdout && stdout.trim()) {
        this.logger.log('Migration output:', stdout.trim());
      }
    } catch (error) {
      this.logger.error('❌ Migration failed:', error.message);

      // In production, we want to fail fast if migrations fail
      if (environment === 'production') {
        this.logger.error(
          '🚨 Critical: Database migration failed in production - application will not start',
        );
        throw new Error(
          `Critical: Database migration failed in production: ${error.message}`,
        );
      }

      // In development, log the error but don't crash the app
      this.logger.warn(
        '⚠️ Migration failed in development environment, continuing with existing schema...',
      );
    }
  }

  /**
   * Check if database is accessible and migrations are up to date
   */
  async healthCheck(): Promise<{
    status: string;
    message: string;
    details?: any;
  }> {
    try {
      // Test database connection
      await this.$queryRaw`SELECT 1`;

      return {
        status: 'healthy',
        message: 'Database connection is healthy',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Database health check failed: ${error.message}`,
        details: { error: error.message },
      };
    }
  }
}
