import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const uploadsPath = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsPath)) {
    mkdirSync(uploadsPath, { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  
  app.enableCors({
    origin: ['https://proyecto-final-avance-ii-completo-2.onrender.com'//,'http://localhost:4200'
    ],
    credentials: true,
  });

  app.useStaticAssets(uploadsPath, { prefix: '/uploads/' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Burrito Lector API')
    .setDescription('API REST para gestión de libros, reseñas y afinidades de lectura')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();