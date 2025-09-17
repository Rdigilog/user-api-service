import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from './config/config.keys';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      preflightContinue: false,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    },
  });

  const configService = app.get(ConfigService);
  
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('DigiLog Admin API Documentation')
    .setDescription('The DigiLog API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Optional: just a hint for Swagger UI
        name: 'Authorization',
        in: 'header',
      },
      'access-token', // This name is used in the decorator below
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  await app.listen(configService.get<number>(CONFIG_KEYS.PORT) ?? 3000);
}
bootstrap();
