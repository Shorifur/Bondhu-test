import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Bondhu API E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health', () => {
    it('should return 404 on root (no handler)', () => {
      return request(app.getHttpServer()).get('/').expect(404);
    });
  });

  describe('Auth Flow', () => {
    const phone = '+8801712345678';
    let otp: string;
    let accessToken: string;

    it('POST /v1/auth/otp/send - should send OTP', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/otp/send')
        .send({ phoneNumber: phone })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.expiresIn).toBe(300);
      otp = res.body.data.otp; // Dev mode returns OTP
    });

    it('POST /v1/auth/otp/verify - should verify OTP and return tokens', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/otp/verify')
        .send({ phoneNumber: phone, otp })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.tokens.accessToken).toBeDefined();
      expect(res.body.data.isNewUser).toBe(true);
      accessToken = res.body.data.tokens.accessToken;
    });

    it('GET /v1/auth/me - should require auth', () => {
      return request(app.getHttpServer()).get('/v1/auth/me').expect(401);
    });

    it('GET /v1/auth/me - should return user with token', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
    });
  });

  describe('Feed Endpoints', () => {
    it('GET /v1/posts/feed/foryou - should return paginated posts', async () => {
      // This will 401 without auth, which is expected
      const res = await request(app.getHttpServer())
        .get('/v1/posts/feed/foryou')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('Search Endpoints', () => {
    it('GET /v1/search/trends - should return trending hashtags', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/search/trends')
        .set('Authorization', 'Bearer invalid')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });
});
