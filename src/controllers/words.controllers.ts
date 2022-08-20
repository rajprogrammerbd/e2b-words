require('dotenv').config();
import express from 'express';
import wordServices from '../services/words.services';
import axios, { AxiosResponse } from 'axios';
import { WordsAppRequestBody, FoundUser } from '../utils/types';

axios.defaults.headers.common['Authorization'] = process.env.AUTHORIZATION_CODE as string || '';

async function addWords(req: express.Request, res: express.Response) {
    // console.log('req obj ', req.isAccessible, req.userEmail, req.body);
    if (req.isAccessible && req.userEmail !== undefined) {
        const { englishWord, banglaWords, relatedEnglishWords } = req.body as WordsAppRequestBody;

        if (englishWord !== undefined && banglaWords !== undefined && relatedEnglishWords !== undefined) {

            const object: any = { englishWord, banglaWords, relatedEnglishWords };

            await axios.post(`${process.env.USER_REPO_ACCESS_URL}/auth/find`, { email: req.userEmail }).then(async (user: AxiosResponse) => {
                try {
                    res.json(await wordServices.addWord(object, user.data as FoundUser));
                } catch (err: any) {
                    throw new Error(err);
                }
            }).catch(() => {
                res.status(500).send({ message: 'Internal Error on connect with User' });
            });

        } else res.status(404).send({ message: 'User needs to send required data' });

    } else res.status(401).send({ message: "User needs to be authenticated" });
}

export default {
    addWords,
};
