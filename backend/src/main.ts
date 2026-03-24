import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}/api`);
  console.log(`📋 Endpoints:`);
  console.log(`   GET  /api/stellar/contract`);
  console.log(`   GET  /api/stellar/stats`);
  console.log(`   POST /api/auth/challenge`);
  console.log(`   POST /api/auth/verify`);
  console.log(`   GET  /api/jobs`);
  console.log(`   POST /api/jobs`);
  console.log(`   GET  /api/milestones/job/:id`);
  console.log(`   GET  /api/disputes`);
  console.log(`   GET  /api/users/:address`);
}
bootstrap();
