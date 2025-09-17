# User API Service - Migration Guide

This guide explains how to use the auto-migration feature and health check APIs in the User API Service.

## 🚀 Auto Migration

The User API Service includes an automatic database migration system that runs on startup when enabled.

### Configuration

| Environment Variable | Default       | Description                                   |
| -------------------- | ------------- | --------------------------------------------- |
| `AUTO_MIGRATE`       | `false`       | Enable auto migration on startup              |
| `NODE_ENV`           | `development` | Environment (affects error handling behavior) |

### Usage

#### Enable Auto Migration

Set the environment variable:

```bash
AUTO_MIGRATE=true
```

#### Production Deployment

For production deployments, auto migration is recommended:

```bash
AUTO_MIGRATE=true NODE_ENV=production pnpm run start:prod
```

#### Docker Deployment

The Dockerfile includes auto migration support:

```bash
docker build -t user-api-service .
docker run -e AUTO_MIGRATE=true -e NODE_ENV=production user-api-service
```

#### Docker Compose

Use the provided docker-compose files:

```bash
# Using docker-compose.prod.yml
AUTO_MIGRATE=true docker-compose -f docker-compose.prod.yml up

# Using services.yml
AUTO_MIGRATE=true docker-compose -f services.yml up
```

### Migration Behavior

- **Development**: If migration fails, the application continues with existing schema
- **Production**: If migration fails, the application fails to start (fail-fast)
- **Disabled**: When `AUTO_MIGRATE=false`, migrations are skipped entirely

### Migration Commands

The service uses `prisma migrate deploy` for production-safe migrations.

## 🏥 Health Check APIs

The service provides comprehensive health check endpoints:

### Endpoints

| Endpoint                   | Method | Description                                |
| -------------------------- | ------ | ------------------------------------------ |
| `/api/v1/health`           | GET    | Complete health check (service + database) |
| `/api/v1/health/db`        | GET    | Database-only health check                 |
| `/api/v1/health/migration` | GET    | Migration system status check              |

### Health Check Response

#### Healthy Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": {
    "status": "healthy",
    "message": "Database connection is healthy"
  },
  "uptime": 3600.5,
  "memory": {
    "rss": 45678592,
    "heapTotal": 20971520,
    "heapUsed": 15728640,
    "external": 1234567
  }
}
```

#### Unhealthy Response

```json
{
  "status": "unhealthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": {
    "status": "unhealthy",
    "message": "Database health check failed: Connection refused",
    "details": {
      "error": "Connection refused"
    }
  },
  "uptime": 3600.5,
  "memory": {
    "rss": 45678592,
    "heapTotal": 20971520,
    "heapUsed": 15728640,
    "external": 1234567
  }
}
```

### Migration Status Response

```json
{
  "status": "success",
  "message": "Migration system is working",
  "database": {
    "status": "healthy",
    "message": "Database connection is healthy"
  },
  "availableModels": ["User", "Role", "Plan", "TermLegal"],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🐳 Docker Health Checks

The Dockerfile includes built-in health checks:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider --timeout=5 http://localhost:3000/api/v1/health || exit 1
```

### Health Check Parameters

- **Interval**: 30 seconds between checks
- **Timeout**: 10 seconds for each check
- **Start Period**: 60 seconds grace period on startup
- **Retries**: 3 consecutive failures before marking unhealthy

## 🚀 Deployment Scripts

### Deploy Script

Use the provided deployment script:

```bash
./scripts/deploy.sh
```

This script:

1. Builds the application
2. Regenerates Prisma client
3. Starts with auto migration enabled

### Manual Deployment

```bash
# Build
pnpm run build

# Generate Prisma client
pnpm run db:generate

# Start with auto migration
AUTO_MIGRATE=true NODE_ENV=production pnpm run start:prod
```

## 🔧 Development

### Local Development

```bash
# Start without auto migration (default)
pnpm run start:dev

# Start with auto migration
AUTO_MIGRATE=true pnpm run start:dev
```

### Testing Health Checks

```bash
# Test main health endpoint
curl http://localhost:3000/api/v1/health

# Test database health
curl http://localhost:3000/api/v1/health/db

# Test migration status
curl http://localhost:3000/api/v1/health/migration
```

## 📊 Monitoring

### Health Check Monitoring

Monitor the health endpoints for:

- Service availability
- Database connectivity
- Migration system status

### Logs

The service logs migration activities:

- Migration start/completion
- Migration failures
- Health check results

### Docker Health Status

Check container health:

```bash
docker ps  # Shows health status
docker inspect <container_id>  # Detailed health information
```

## 🚨 Troubleshooting

### Migration Issues

1. **Migration fails in production**: Check database connectivity and permissions
2. **Migration skipped**: Verify `AUTO_MIGRATE=true` is set
3. **Schema conflicts**: Review migration files and database state

### Health Check Issues

1. **Health check fails**: Check database connection and service status
2. **Docker health check fails**: Verify port 3001 is accessible
3. **Migration status error**: Check Prisma configuration and database access

### Common Solutions

```bash
# Reset and retry migration
AUTO_MIGRATE=true NODE_ENV=development pnpm run start:dev

# Check database connection
pnpm run db:studio

# Verify Prisma client
pnpm run db:generate
```

## 📝 Best Practices

1. **Always enable auto migration in production**
2. **Monitor health check endpoints**
3. **Use Docker health checks for orchestration**
4. **Test migrations in development first**
5. **Keep migration files in version control**
6. **Use the deployment script for consistency**

## 🔗 Related Documentation

- [Prisma Migration Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [NestJS Health Checks](https://docs.nestjs.com/recipes/terminus)
- [Docker Health Checks](https://docs.docker.com/engine/reference/builder/#healthcheck)
