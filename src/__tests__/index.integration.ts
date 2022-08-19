import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import appPort from '../../index';

const URL = process.env.MONGODB_ACCESS_URL as string;

jest.mock('../middlewares/winston', () => ({
    __esModule: true,
    default: {
        error: jest.fn()
    }
}));

beforeEach((done) => {
    mongoose.connect(URL).then(() => done());
});

afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
        appPort.close();
        mongoose.connection.close(() => done());
    });
});

const defaultAgent = new Proxy(request(appPort), {
    get: (target, name) => (...args: any[]) =>
      (target as any)[name](...args).set({
        'Authorization': process.env.AUTHORIZATION_CODE as string
    })
});

test('GET - / - Success to retrieve homepage endpoint', async () => {
    const res = await defaultAgent.get('/');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Hello' });
});
