import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())
  app.useStaticAssets(path.join(__dirname,"../assets"));
  await app.listen(8000);
  console.log('http://localhost:8000/')
}
bootstrap();
