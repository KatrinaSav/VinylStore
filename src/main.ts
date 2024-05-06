import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { RolesGuard } from './common/roles.guard';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TypeormStore } from 'connect-typeorm';
import { Session } from './auth/session.entity';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const configService = app.get(ConfigService);
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  const config = new DocumentBuilder()
    .setTitle('Vinyl Store')
    .setDescription('API for vinyl store')
    .setVersion('1.0')
    .build();
  const sessionRepository = app.get(DataSource).getRepository(Session);
  app.use(
    session({
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore().connect(sessionRepository),
      cookie: { maxAge: parseInt(configService.get('COOKIE_MAX_AGE')) },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
