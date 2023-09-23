import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: 10048576 }),
    { snapshot: true },
  );

  const port = +process.env.PORT || 3001;

  const options = new DocumentBuilder()
    .setTitle('TrueNorth')
    .setDescription('TrueNorth Challenge')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('swagger', app, document);

  app.enableCors();
  await app.listen(port);

  console.log('App is running on port test:', port);
}
bootstrap();
