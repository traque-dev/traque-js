import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { traque } from './traque';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  traque.setupNestExceptionFilter(app);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch(console.error);
