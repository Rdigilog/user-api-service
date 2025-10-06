# Configuration Management

This service supports two different configuration approaches depending on the environment:

## Local Development (`NODE_ENV=local`)

- Uses `.env` files for configuration
- All environment variables are optional for flexibility
- Create a `.env` file in the root directory with your local configuration

### Required Environment Variables for Local:

```bash
# Server
PORT=3000
NODE_ENV=local

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/user_service_db
DATABASE_URL_REPLICA=postgresql://username:password@localhost:5432/user_service_db
AUTO_MIGRATE=false

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-local-jwt-secret-key-here
JWT_EXPIRATION_TIME=86400

# Frontend
FRONTEND_URL=http://localhost:3000

# Mail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
```

## Development/Production (`NODE_ENV=development` or `NODE_ENV=production`)

- Uses AWS Secrets Manager for configuration
- Environment variables are minimal (only PORT and AWS configuration)
- All sensitive data is stored in AWS Secrets Manager

### Required Environment Variables for Cloud:

```bash
# Server
PORT=3000
NODE_ENV=development  # or production

# AWS Configuration
AWS_REGION=eu-west-2
AWS_SECRET_ID=dev-secret-manager-01  # or your production secret ID
```

### AWS Secrets Manager Structure

The service expects the following structure in your AWS Secrets Manager secret:

```json
{
  "REDIS_URL": "digi-redis-dev.bhkzia.ng.0001.euw2.cache.amazonaws.com:6379",
  "DATABASE_URL": "digi-postgres-dev.c16mmuc2szl2.eu-west-2.rds.amazonaws.com",
  "NODE_ENV": "development",
  "FRONTEND_URL": "https://dev.radiantdigilog.com",
  "JWT_SECRET": "1a15b950bfc048f98a1404ee38545b7a240b3a5086f1edf278a6eb070a7fe463",
  "JWT_EXPIRATION_TIME": "86400",
  "DATABASE_URL_REPLICA": "digi-postgres-dev.c16mmuc2szl2.eu-west-2.rds.amazonaws.com",
  "AUTO_MIGRATE": "false",
  "MAIL_HOST": "xxx",
  "MAIL_PORT": "465",
  "MAIL_USER": "xxx",
  "MAIL_PASS": "xxx"
}
```

## Features

### Intelligent Configuration Loading

- Automatically detects environment and chooses appropriate configuration source
- No code changes needed when switching between environments
- Caching mechanism for AWS Secrets Manager to improve performance

### Security

- Sensitive data is never stored in environment variables in cloud environments
- AWS Secrets Manager provides encryption at rest and in transit
- IAM-based access control for secrets

### Performance

- Configuration is cached for 5 minutes to reduce AWS API calls
- Async configuration loading with proper error handling
- Fallback mechanisms for missing configuration

## Migration Guide

### From .env to AWS Secrets Manager

1. **Set up AWS Secrets Manager secret** with the structure shown above
2. **Update your deployment** to set `NODE_ENV=development` or `NODE_ENV=production`
3. **Add AWS environment variables**:
   - `AWS_REGION=eu-west-2`
   - `AWS_SECRET_ID=your-secret-id`
4. **Remove sensitive environment variables** from your deployment configuration
5. **Keep only PORT** as an environment variable for flexibility

### Local Development Setup

1. **Create `.env` file** in the root directory
2. **Set `NODE_ENV=local`** in your `.env` file
3. **Add all required configuration** as shown in the local development section above

## Troubleshooting

### Common Issues

1. **AWS Credentials**: Ensure your AWS credentials are properly configured
2. **Secret ID**: Verify the secret ID exists in AWS Secrets Manager
3. **Region**: Make sure the AWS region matches where your secret is stored
4. **Permissions**: Ensure your AWS credentials have `secretsmanager:GetSecretValue` permission

### Debug Mode

Set `NODE_ENV=local` temporarily to use environment variables for debugging cloud configuration issues.
