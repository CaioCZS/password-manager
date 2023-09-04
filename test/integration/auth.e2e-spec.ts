import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { E2EUtils } from '../utils/e2e.utils';
import { UserFactory } from '../factories/user.factory';

describe('Auth E2E Tests', () => {
  let app: INestApplication;
  let server: request.SuperTest<request.Test>;
  const prisma: PrismaService = new PrismaService();
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    server = request(app.getHttpServer());

    await app.init();

    await E2EUtils.cleanDb(prisma);
  });
  const baseRoute = '/auth';
  describe('POST /auth/sign-up', () => {
    it('should respond with status 400 if password is not strong enough', async () => {
      const user = new UserFactory(prisma)
        .withWeakPassword()
        .withEmail()
        .build();
      const { statusCode } = await server
        .post(`${baseRoute}/sign-up`)
        .send(user);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 409 if email already in use', async () => {
      const firstUser = await new UserFactory(prisma)
        .withStrongPassword()
        .withEmail()
        .persist();
      const secondUser = new UserFactory(prisma)
        .withStrongPassword()
        .withEmail(firstUser.email)
        .build();

      const { statusCode } = await server
        .post(`${baseRoute}/sign-up`)
        .send(secondUser);

      expect(statusCode).toBe(HttpStatus.CONFLICT);
    });

    it('should create a new user in database', async () => {
      const user = new UserFactory(prisma)
        .withStrongPassword()
        .withEmail()
        .build();
      const { statusCode } = await server
        .post(`${baseRoute}/sign-up`)
        .send(user);

      expect(statusCode).toBe(HttpStatus.CREATED);

      const userCreated = await prisma.user.findFirst({
        where: { email: user.email },
      });
      expect(userCreated).not.toBe(null);
    });
  });
  describe('POST /auth/sign-in', () => {
    it('should respond with status 400 if body empty', async () => {
      const { statusCode } = await server.post(`${baseRoute}/sign-in`).send({});
      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status 401 if e-mail does not exist', async () => {
      const { statusCode, body } = await server
        .post(`${baseRoute}/sign-in`)
        .send({ email: 'email@test.com', password: 'password' });

      expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(body).toEqual({
        message: 'E-mail e/ou senha inválidos',
        statusCode: 401,
      });
    });

    it('should respond with status 401 if password for given e-mail is wrong', async () => {
      const user = await new UserFactory(prisma)
        .withStrongPassword()
        .withEmail()
        .persist();
      const { statusCode, body } = await server
        .post(`${baseRoute}/sign-in`)
        .send({ email: user.email, password: 'wrongPassword' });

      expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(body).toEqual({
        message: 'E-mail e/ou senha inválidos',
        statusCode: 401,
      });
    });

    it('should respond with token if password for guiven e-mail is correct', async () => {
      const user = await new UserFactory(prisma)
        .withStrongPassword()
        .withEmail()
        .persist();
      const { statusCode, body } = await server
        .post(`${baseRoute}/sign-in`)
        .send({ email: user.email, password: user.descriptedPassword });

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.token).toBeDefined();
    });
  });
});
