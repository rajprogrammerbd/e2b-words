import Database from '../config/db.config';
import wordsSchema from '../config/schema/words';
import { WordsAppRequestBody, FoundUser, AddWordResponseType, AddWordErrorResponse } from '../utils/types';
import logger from '../middlewares/winston';

interface HomePageProps {
message: string;
}

export const Words = Database.prepare(wordsSchema, 'words');

function addWord(object: WordsAppRequestBody, user: FoundUser): Promise<AddWordResponseType | AddWordErrorResponse> {
    return new Promise(async (resolve, reject) => {
        const { englishWord, banglaWords, relatedEnglishWords } = object;
        const { email, userName, AccessType } = user;
    
        try {
            await Words.find({ englishWord }).then(async (findWord: any) => {
                if (findWord.length === 0) {
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
                    resolve(final);
                    return;
                } else {
                    reject('Word already existed');
                }
            });
    
    
        } catch (err) {
            logger.error(err);
            reject(err);
        }
    });
}

export default {
    addWord,
};
