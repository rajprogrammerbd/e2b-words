import Database from '../config/db.config';
import wordsSchema from '../config/schema/words';
import { WordsAppRequestBody, FoundUser, AddWordResponseType, AddWordErrorResponse } from '../utils/types';
import logger from '../middlewares/winston';

interface HomePageProps {
message: string;
}

export const Words = Database.prepare(wordsSchema, 'words');

async function addWord(object: WordsAppRequestBody, user: FoundUser): Promise<AddWordResponseType | AddWordErrorResponse> {
    const { englishWord, banglaWords, relatedEnglishWords } = object;
    const { email, userName, AccessType } = user;

    try {
        const word = new Words({
            englishWord,
            banglaWords,
            relatedEnglishWords,
            user: {
                email,
                username: userName,
                accessType: AccessType,
            }
        });

        const wordObject = await word.save();
        const final = {
            englishWord: wordObject.englishWord,
            banglaWords: wordObject.banglaWords,
            relatedEnglishWords: wordObject.relatedEnglishWords,
            user: wordObject.user,

        };
        return Promise.resolve(final);

    } catch (err) {
        logger.error(err);
        return Promise.reject(err);
    }

}

export default {
    addWord,
};
