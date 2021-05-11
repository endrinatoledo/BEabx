const {getDataFromApi,postDataFromApi,putDataFromApi,deleteDataFromApi} = require('./getDataFromApi');
const testData = require('./testData');

describe('Probando commentsController', () => {
    test('Realizando una peticion POST a addComments', async (done) => {
        const api = testData.url + 'users/1/agreements/comments';
        postDataFromApi(api,testData.data.commentsController).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });
    test('Realizando una peticion  a getComments', async (done) => {
        const api = testData.url + 'users/1/agreements/comments';
        getDataFromApi(api).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });
});