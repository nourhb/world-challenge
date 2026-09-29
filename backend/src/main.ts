import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { isProduction, publicSiteUrl } from './common/public-url';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: isProduction()
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
              fontSrc: ["'self'", 'https://fonts.gstatic.com'],
              imgSrc: [
                "'self'",
                'data:',
                'blob:',
                'https://flagcdn.com',
                'https://*.basemaps.cartocdn.com',
                'https://*.tile.openstreetmap.org',
              ],
              connectSrc: ["'self'", 'ws:', 'wss:', 'https://*.basemaps.cartocdn.com'],
              workerSrc: ["'self'", 'blob:'],
            },
          }
        : false,
    }),
  );
  app.use(cookieParser());
  const siteUrl = publicSiteUrl();
  app.enableCors({
    origin: isProduction() ? [siteUrl] : true,
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('World Challenge API')
    .setDescription(
      'Usable vertical slice: auth, countries, passport, discover, and live culture games.',
    )
    .setVersion('0.3.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  const port = Number(process.env.PORT ?? 5000);
  const clientDir = process.env.CLIENT_DIR;
  const serveClient =
    isProduction() && clientDir && existsSync(join(clientDir, 'index.html'));

  if (serveClient && clientDir) {
    app.useStaticAssets(clientDir);
  }

  await app.init();

  if (serveClient && clientDir) {
    const server = app.getHttpAdapter().getInstance();
    server.get('*', (request: Request, response: Response, next: NextFunction) => {
      if (
        request.path.startsWith('/api') ||
        request.path.startsWith('/socket.io') ||
        request.path.startsWith('/swagger')
      ) {
        next();
        return;
      }
      response.sendFile(join(clientDir, 'index.html'));
    });
  }

  await app.listen(port, '0.0.0.0');
}

void bootstrap();
