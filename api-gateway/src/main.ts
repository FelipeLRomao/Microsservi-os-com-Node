import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },    
    },
    crossOriginResourcePolicy: false,
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  }));

  app.enableCors({
   origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['*'];

    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin))  {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
   },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
    ],
    credentials: true,
    maxAge: 864600, //24horas
    });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Marketplace API Gateway')
    .setDescription('API Gateway for Marketplace Microservices')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3005;
  await app.listen(port);

  console.log(`🚀 API Gateway is running on http://localhost:${port} 💻✨`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api 📖💫`);
}

bootstrap();
