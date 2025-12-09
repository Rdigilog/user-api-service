import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Server
  PORT: Joi.number().default(3001),
  NODE_ENV: Joi.string()
    .valid('local', 'development', 'production')
    .default('development'),
  FRONTEND_URL: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().default('1h'),

  // Database
  DATABASE_URL: Joi.string().required(),
  DATABASE_URL_REPLICA: Joi.string().required(),
  AUTO_MIGRATE: Joi.string().default('false'),

  // Redis
  REDIS_URL: Joi.string().required(),

  // Mail
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.number().default(465),
  MAIL_USER: Joi.string().required(),
  MAIL_PASS: Joi.string().required(),

  // AWS Configuration (optional for local, required for cloud)
  AWS_REGION: Joi.string().when('NODE_ENV', {
    is: 'local',
    then: Joi.string().optional(),
    otherwise: Joi.string().default('eu-west-2'),
  }),
  AWS_SECRET_ID: Joi.string().when('NODE_ENV', {
    is: 'local',
    then: Joi.string().optional(),
    otherwise: Joi.string().default('dev-secret-manager-01'),
  }),
});
