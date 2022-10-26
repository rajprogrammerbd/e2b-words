import mongoose from 'mongoose';
import request from 'supertest';
import supertest from 'supertest';
import appPort from '../../index';
import { Words } from '../services/words.services';
require('dotenv').config();

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

test('Test e2b integration test', async () => {
    const customAgent = new Proxy(supertest(appPort), {
      get: (target, name) => (...args: any[]) =>
       (target as any)[name](...args).set({
         'Authorization': process.env.AUTHORIZATION_CODE as string,
         'Cookie': `LOGIN_ACCESS_COOKIE=${process.env.COOKIES as string}`,
       })
   });

   const res = await customAgent.get('/');

   expect(res.statusCode).toBe(200);
   expect(res.body).toEqual({ message: 'Hello' });

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

    const addWord = await customAgent.post('/api/add/word').send(body);

    expect(addWord.statusCode).toBe(200);
    expect(addWord.body).toEqual({
        ...body,
        user: {
            email: "rd2249619@gmail.com",
            username: "rajprogrammerbd",
            accessType: "Admin"
        }
    });

    const reAddWord = await customAgent.post('/api/add/word').send(body);

    expect(reAddWord.statusCode).toBe(500);
    expect(reAddWord.body).toEqual({
        message: 'Word already existed'
    });

    const missingData = await customAgent.post('/api/add/word').send({});
    
    expect(missingData.statusCode).toBe(404);
    expect(missingData.body).toEqual({
        message: 'User needs to send required data'
    });
    await Words.remove({ englishWord: body.englishWord });
}, 20000);

test('DELETE - /api/add/word', async () => {
    const body = {
        englishWord: "demoWords",
        banglaWords: ["শৈশব"],
        relatedEnglishWords: ["infancy", "babyhood"]
    };

    const customAgent = new Proxy(supertest(appPort), {
        get: (target, name) => (...args: any[]) =>
         (target as any)[name](...args).set({
           'Authorization': process.env.AUTHORIZATION_CODE as string,
           'Cookie': `LOGIN_ACCESS_COOKIE=${process.env.COOKIES as string}`,
         })
     });

     const successCase = await customAgent.post('/api/add/word').send(body);

     expect(successCase.statusCode).toBe(200);
     expect(successCase.body).toEqual({
         ...body,
         user: {
             email: "rd2249619@gmail.com",
             username: "rajprogrammerbd",
             accessType: "Admin"
         }
     });

     const deleted = await customAgent.delete('/api/remove/word').send({ englishWord: "demoWords" });
     expect(deleted.statusCode).toBe(200);
     expect(deleted.body).toEqual({
        status: true
     });

     await Words.deleteOne({ englishWord: body.englishWord });
});