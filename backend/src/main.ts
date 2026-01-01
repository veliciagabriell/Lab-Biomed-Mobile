import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import admin from '../firebase/firebase';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const config = new DocumentBuilder()
    .setTitle('Lab Biomed API')
    .setDescription('API documentation for Lab Biomed Mobile Application')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token'
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend running on port ${port}`);
  console.log('Firebase apps:', admin.apps.length);
}
bootstrap();