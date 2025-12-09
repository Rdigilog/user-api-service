export const CONFIG_KEYS = {
  // Server
  PORT: 'port',
  NODE_ENV: 'nodeEnv',
  FRONTEND_URL: 'frontendUrl',

  // JWT
  JWT_SECRET: 'jwt.secret',
  JWT_EXPIRATION_TIME: 'jwt.expirationTime',

  // Database
  DATABASE_URL: 'database.url',
  DATABASE_REPLICA_URL: 'database.replicaUrl',
  AUTO_MIGRATE: 'database.autoMigrate',

  // Redis
  REDIS_URL: 'redis.url',

  // Mail
  MAIL_HOST: 'mail.host',
  MAIL_PORT: 'mail.port',
  MAIL_USER: 'mail.user',
  MAIL_PASS: 'mail.pass',
} as const;
