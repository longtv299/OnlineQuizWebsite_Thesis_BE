import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // init app
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'debug', 'warn'],
  });

  const config = new DocumentBuilder()
    .setTitle('English quizzes')
    .setDescription('English quizzes API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'token',
    )
    .addSecurityRequirements('token')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
  console.clear();
  console.log('view docs at: http://localhost:3000/docs');
}
bootstrap();
