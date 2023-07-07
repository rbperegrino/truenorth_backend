import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: 10048576 }),
    { snapshot: true },
  );

  const port = +process.env.SERVER_PORT || 3001;

  app.enableCors();
  await app.listen(port);

  console.log('App is running on port:', port);
}
bootstrap();
