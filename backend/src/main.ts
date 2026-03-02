import * as crypto from 'crypto';
import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe, ClassSerializerInterceptor} from '@nestjs/common';
import {JwtAuthGuard} from "./auth/guard/jwt-auth.guard";

(global as any).crypto = crypto;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: ['http://localhost:5173'],
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    await app.listen(3000);
}

bootstrap();