import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../config/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  async healthCheck() {
    const dbHealth = await this.prismaService.healthCheck();
    const isHealthy = dbHealth.status === 'healthy';
    if (!isHealthy) {
      throw new ServiceUnavailableException({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: dbHealth,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      });
    }
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  @Get('db')
  @ApiOperation({ summary: 'Database health check' })
  @ApiResponse({ status: 200, description: 'Database is healthy' })
  @ApiResponse({ status: 503, description: 'Database is unhealthy' })
  async databaseHealthCheck() {
    return await this.prismaService.healthCheck();
  }

  @Get('migration')
  @ApiOperation({ summary: 'Check migration status' })
  @ApiResponse({ status: 200, description: 'Migration status retrieved' })
  async migrationStatus() {
    try {
      // Check if we can query the database
      const dbHealth = await this.prismaService.healthCheck();

      // Get available models to verify schema is loaded
      const models = await this.prismaService.models();

      return {
        status: 'success',
        message: 'Migration system is working',
        database: dbHealth,
        availableModels: models,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Migration system check failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
