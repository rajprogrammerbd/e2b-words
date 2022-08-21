import Database from '../config/db.config';
import wordsSchema from '../config/schema/words';
import { WordsAddRequestBody, FoundUser, AddWordResponseType, AddWordErrorResponse, ACCESS_TYPE } from '../utils/types';
import logger from '../middlewares/winston';
import { deletedOne } from '../common/delete';
import findValue from '../common/find';

export const Words = Database.prepare(wordsSchema, 'words');

function addWord(object: WordsAddRequestBody, user: FoundUser): Promise<AddWordResponseType | AddWordErrorResponse> {
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

async function deleting(resolve: any, reject: any, modal: any, obj: any) {
    return await deletedOne({ modal, obj }).then((res: any) => resolve(res)).catch(() => reject({ message: 'Failed to delete the word' }));
}

function removeWord(accessType: ACCESS_TYPE, word: string) {
    return new Promise(async (resolve, reject) => {
        const userType = {
            admin: 'Admin',
            user: 'User',
            temp: 'Temp'
        };

        const findWord = await findValue({ modal: Words, queryObj: { englishWord: word } });

        if (findWord.res.length === 1) {
            const { user } = findWord.res[0];
            if ( accessType === userType.admin ) {
                deleting(resolve, reject, Words, { englishWord: word });
            } else {
                if ( user.accessType === accessType ) {
                    deleting(resolve, reject, Words, { englishWord: word });
                } else {
                    reject({ message: "User doesn't have permission to delete" });
                }
            }

        } else if (findWord.res.length === 0) {
            reject({ message: "Couldn't able to find the word" });
        } else {
            reject({ message: 'Found multiple data. Internal Error' });
        }
    });
}

export default {
    addWord,
    removeWord
};
