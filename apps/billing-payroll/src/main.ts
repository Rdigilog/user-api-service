import { NestFactory } from '@nestjs/core';
import { BillingPayrollModule } from './billing-payroll.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(BillingPayrollModule, {
    cors: {
      origin: '*',
      preflightContinue: false,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    },
  });
  // const app = await NestFactory.create(AppModule,);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  // app.useGlobalInterceptors(new StatusInterceptor());
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('DigiLog API Documentation')
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
  await app.listen(process.env.BILLING_SERVICE_PORT || 7005);
}
bootstrap();
