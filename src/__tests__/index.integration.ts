import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import appPort from '../../index';
import { Words } from '../services/words.services';

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
        'Authorization': process.env.AUTHORIZATION_CODE as string,
        'Cookie': 'LOGIN_ACCESS_COOKIE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJkMjI0OTYxOUBnbWFpbC5jb20iLCJpZCI6IjYyZmYyNmExZTYwNGViOWI1MTE5MDQ5MSIsImlhdCI6MTY2MDk3OTA5MiwiZXhwIjoxNjYxMDY1NDkyfQ.13pteQtCOCFzGufkQAZnuawEUBAFHfnRqrmYlWksPDc'
    })
});

test('GET - / - Success to retrieve homepage endpoint', async () => {
    const res = await defaultAgent.get('/');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Hello' });
});

test('POST - /api/add/word', async () => {
    const mockAgent = new Proxy(request(appPort), {
        get: (target, name) => (...args: any[]) =>
          (target as any)[name](...args).set({
            'Authorization': process.env.AUTHORIZATION_CODE as string,
        })
    });

    const body = {
        englishWord: "demoWords",
        banglaWords: ["শৈশব"],
        relatedEnglishWords: ["infancy", "babyhood"]
    };

    const userNeedLogin = await mockAgent.get('/');

    expect(userNeedLogin.statusCode).toBe(401);
    expect(userNeedLogin.body).toEqual({ message: 'User needs to login' });

    const addWord = await defaultAgent.post('/api/add/word').send(body);

    expect(addWord.statusCode).toBe(200);
    expect(addWord.body).toEqual({
        ...body,
        user: {
            email: "rd2249619@gmail.com",
            username: "rajprogrammerbd",
            accessType: "Admin"
        }
    });

    const reAddWord = await defaultAgent.post('/api/add/word').send(body);

    expect(reAddWord.statusCode).toBe(500);
    expect(reAddWord.body).toEqual({
        message: 'Word already existed'
    });

    const missingData = await defaultAgent.post('/api/add/word').send({});
    
    expect(missingData.statusCode).toBe(404);
    expect(missingData.body).toEqual({
        message: 'User needs to send required data'
    });

    await Words.remove({ englishWord: body.englishWord });
}, 10000);
