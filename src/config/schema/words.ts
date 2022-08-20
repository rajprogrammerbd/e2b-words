const arrayType = [{ type: String, required: true }];
const stringType = { type: String, required: true };

const wordsSchema = {
    englishWord: stringType,
    banglaWords: arrayType,
    relatedEnglishWords: arrayType,
    user: {
        email: stringType,
        username: stringType,
        accessType: stringType,
    }
};

export default wordsSchema;
