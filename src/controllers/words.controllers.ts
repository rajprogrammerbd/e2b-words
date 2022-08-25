require('dotenv').config();
import express from 'express';
import wordServices from '../services/words.services';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { WordsAddRequestBody, FoundUser, WordsRemoveRequestBody } from '../utils/types';

axios.defaults.headers.common['Authorization'] = process.env.AUTHORIZATION_CODE as string || '';

async function addWords(req: express.Request, res: express.Response) {
    if (req.isAccessible && req.userEmail !== undefined) {
        const { englishWord, banglaWords, relatedEnglishWords } = req.body as WordsAddRequestBody;

        if (englishWord !== undefined && banglaWords !== undefined && relatedEnglishWords !== undefined) {
            const object: any = { englishWord, banglaWords, relatedEnglishWords };

            await axios.post(`${process.env.USER_REPO_ACCESS_URL}/auth/find`, { email: req.userEmail }).then(async (user: AxiosResponse) => {
                try {
                    res.json(await wordServices.addWord(object, user.data as FoundUser));
                } catch (err: any) {
                    throw new Error(err);
                }
            }).catch((err) => {
                res.status(500).send({ message: err.message });
            });

        } else res.status(404).send({ message: 'User needs to send required data' });

    } else res.status(401).send({ message: "User needs to be authenticated" });
}

async function removeWords(req: express.Request, res: express.Response) {
    if (req.isAccessible && req.userEmail !== undefined) {
        const { englishWord } = req.body as WordsRemoveRequestBody;
        if (englishWord !== undefined) {

            await axios.post(`${process.env.USER_REPO_ACCESS_URL}/auth/find`, { email: req.userEmail }).then(async (user: AxiosResponse) => {
                const { AccessType } = user.data;

                try {
                    res.json(await wordServices.removeWord(AccessType, englishWord));
                } catch (err: any) {
                    res.status(500).send(err);
                }

            }).catch((err: AxiosError) => {
                res.status(500).send(err);
            });

        } else res.status(404).send({ message: 'User needs to send required data' });

    } else res.status(401).send({ message: "User needs to be authenticated" });
}

export default {
    addWords,
    removeWords
};
