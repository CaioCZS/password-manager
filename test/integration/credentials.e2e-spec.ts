import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { E2EUtils } from '../utils/e2e.utils';
import { UserFactory } from '../factories/user.factory';
import { CredentialFactory } from '../factories/credential.factory';
import { generateValidToken } from '../utils/generate-valid-token';
describe('Credentials E2E Tests', () => {
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
  const baseRoute = '/credentials';

  describe('POST /', () => {
    it('should repond with status code 401 if token is invalid', async () => {
      const { statusCode } = await server
        .post(baseRoute)
        .send({})
        .set('Authorization', 'Bearer invalidToken');
      expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should repond with status code 400 if body is invalid', async () => {
      const user = await new UserFactory(prisma)
        .withEmail()
        .withStrongPassword()
        .persist();
      const token = generateValidToken(user);
      const { statusCode } = await server
        .post(baseRoute)
        .send({})
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status code 409 if user alredy used the title given', async () => {
      const user = await new UserFactory(prisma)
        .withEmail()
        .withStrongPassword()
        .persist();
      const firstCredential = await new CredentialFactory(prisma)
        .withPassword()
        .withTitle()
        .withUrl()
        .withUsername()
        .persist(user.id);
      const secondCredential = new CredentialFactory(prisma)
        .withPassword()
        .withTitle(firstCredential.title)
        .withUrl()
        .withUsername()
        .build(user.id);

      const token = generateValidToken(user);
      const { statusCode } = await server
        .post(baseRoute)
        .send(secondCredential)
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(HttpStatus.CONFLICT);
    });
    it('should create a new credential in db with password encrypted', async () => {
      const user = await new UserFactory(prisma)
        .withEmail()
        .withStrongPassword()
        .persist();
      const credential = new CredentialFactory(prisma)
        .withPassword()
        .withTitle()
        .withUrl()
        .withUsername()
        .build(user.id);

      const token = generateValidToken(user);
      const { statusCode } = await server
        .post(baseRoute)
        .send(credential)
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(HttpStatus.CREATED);
      const credentialCreated = await prisma.credential.findFirst({
        where: { title: credential.title },
      });
      expect(credentialCreated).not.toBe(null);
      expect(credentialCreated.password).not.toBe(credential.password); //password must be encrypted in database
    });
  });
  describe('GET /', () => {
    it('should repond with status code 401 if token is invalid', async () => {
      const { statusCode } = await server
        .get(baseRoute)
        .set('Authorization', 'Bearer invalidToken');
      expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with an empty array if user does not have a credential yet', async () => {
      const user = await new UserFactory(prisma)
        .withEmail()
        .withStrongPassword()
        .persist();
      const token = generateValidToken(user);

      const { statusCode, body } = await server
        .get(baseRoute)
        .set('Authorization', `Bearer ${token}`);
      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toEqual([]);
    });
    it('should respond with credentials data of user', async () => {
      const user = await new UserFactory(prisma)
        .withEmail()
        .withStrongPassword()
        .persist();
      const token = generateValidToken(user);
      const { statusCode, body } = await server
        .get(baseRoute)
        .set('Authorization', `Bearer ${token}`);
      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            username: expect.any(String),
            password: expect.any(String),
            url: expect.any(String),
            userId: user.id,
          }),
        ]),
      );
    });
  });
  describe('GET /:id', () => {
    it('should repond with status code 401 if token is invalid', async () => {
      const { statusCode } = await server
        .get(`${baseRoute}/1`)
        .set('Authorization', 'Bearer invalidToken');
      expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status code 400 if id is invalid', async () => {
      const user = await new UserFactory(prisma)
        .withEmail()
        .withStrongPassword()
        .persist();
      const token = generateValidToken(user);

      const { statusCode } = await server
        .get(`${baseRoute}/invalidId`)
        .set('Authorization', `Bearer ${token}`);
      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status code 404 if credential does not exist', async () => {
      const user = await new UserFactory(prisma)
        .withEmail()
        .withStrongPassword()
        .persist();
      const token = generateValidToken(user);

      const { statusCode } = await server
        .get(`${baseRoute}/1`)
        .set('Authorization', `Bearer ${token}`);
      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('should respond with status code 403 if credential is not from user', async () => {
      const firstUser = await new UserFactory(prisma)
        .withEmail()
        .withStrongPassword()
        .persist();

      const secondUser = await new UserFactory(prisma)
        .withEmail()
        .withStrongPassword()
        .persist();

      const credentialOfFirstUser = await new CredentialFactory(prisma)
        .withPassword()
        .withTitle()
        .withUrl()
        .withUsername()
        .persist(firstUser.id);

      const tokenOfSecondUser = generateValidToken(secondUser);

      const { statusCode } = await server
        .get(`${baseRoute}/${credentialOfFirstUser.id}`)
        .set('Authorization', `Bearer ${tokenOfSecondUser}`);

      expect(statusCode).toBe(HttpStatus.FORBIDDEN);
    });

    it('should respond with credential of given id', async () => {
      const user = await new UserFactory(prisma)
        .withEmail()
        .withStrongPassword()
        .persist();

      const credential = await new CredentialFactory(prisma)
        .withPassword()
        .withTitle()
        .withUrl()
        .withUsername()
        .persist(user.id);

      const token = generateValidToken(user);
      const { statusCode, body } = await server
        .get(`${baseRoute}/${credential.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(statusCode).toBe(HttpStatus.OK);
      expect(body.id).toEqual(credential.id);
    });
  });

  describe('DELETE /:id', () => {
    it('should repond with status code 401 if token is invalid', async () => {
      const { statusCode } = await server
        .delete(`${baseRoute}/1`)
        .set('Authorization', 'Bearer invalidToken');
      expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should respond with status code 400 if id is invalid', async () => {
      const user = await new UserFactory(prisma)
        .withEmail()
        .withStrongPassword()
        .persist();
      const token = generateValidToken(user);

      const { statusCode } = await server
        .delete(`${baseRoute}/invalidId`)
        .set('Authorization', `Bearer ${token}`);
      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should respond with status code 404 if credential does not exist', async () => {
      const user = await new UserFactory(prisma)
        .withEmail()
        .withStrongPassword()
        .persist();
      const token = generateValidToken(user);

      const { statusCode } = await server
        .delete(`${baseRoute}/1`)
        .set('Authorization', `Bearer ${token}`);
      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('should respond with status code 403 if credential is not from user', async () => {
      const firstUser = await new UserFactory(prisma)
        .withEmail()
        .withStrongPassword()
        .persist();

      const secondUser = await new UserFactory(prisma)
        .withEmail()
        .withStrongPassword()
        .persist();

      const credentialOfFirstUser = await new CredentialFactory(prisma)
        .withPassword()
        .withTitle()
        .withUrl()
        .withUsername()
        .persist(firstUser.id);

      const tokenOfSecondUser = generateValidToken(secondUser);

      const { statusCode } = await server
        .delete(`${baseRoute}/${credentialOfFirstUser.id}`)
        .set('Authorization', `Bearer ${tokenOfSecondUser}`);

      expect(statusCode).toBe(HttpStatus.FORBIDDEN);
    });

    it('should delete credential from database', async () => {
      const user = await new UserFactory(prisma)
        .withEmail()
        .withStrongPassword()
        .persist();

      const credential = await new CredentialFactory(prisma)
        .withPassword()
        .withTitle()
        .withUrl()
        .withUsername()
        .persist(user.id);

      const token = generateValidToken(user);

      const { statusCode } = await server
        .delete(`${baseRoute}/${credential.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toBe(HttpStatus.OK);

      const verifyDeleted = await prisma.credential.findUnique({
        where: { id: credential.id },
      });

      expect(verifyDeleted).toBe(null);
    });
  });
});
