import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { isNil } from 'lodash';

import { AppModule } from './app.module';

async function bootstrap() {
    if (isNil(process.env.NODE_ENV)) {
        process.env.NODE_ENV = 'production';
    }
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    app.setGlobalPrefix('api');
    app.enableCors();
    const config = new DocumentBuilder()
        .setTitle('blog api')
        .setDescription('The blog API for swagger')
        .setVersion('1.0')
        .addTag('blog')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.listen(process.env.NODE_ENV === 'production' ? 3600 : 3000, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
