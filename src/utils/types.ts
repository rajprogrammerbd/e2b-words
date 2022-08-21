export type ACCESS_TYPE = 'Admin' | 'User' | 'Temp';

export interface WordsAddRequestBody {
    englishWord: string;
    banglaWords: string[];
    relatedEnglishWords: string[];
}

export interface WordsRemoveRequestBody {
    englishWord: string;
}

export interface AddWordResponseType {
    englishWord: string;
    banglaWords: string[];
    relatedEnglishWords: string[];
    user: {
        email: string,
        username: string,
        accessType: string,
    }
}

export interface AddWordErrorResponse {
    message: string;
}

export interface FoundUser {
    name: string;
    email: string;
    userName: string;
    AccessType: string;
}