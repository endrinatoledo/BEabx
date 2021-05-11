const {getDataFromApi,postDataFromApi,putDataFromApi} = require('./getDataFromApi');
const testData = require('./testData');

describe('Probando agreementController', () => {
    test('Realizando una peticion a getNextStatus', async (done) => {
        const api = testData.url + 'agreements/nextStatus/1';
        getDataFromApi(api).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });
    test('Realizando una peticion a getAllByUser', async (done) => {
        const api = testData.url + 'agreement/group/1';
        getDataFromApi(api).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });
    test('Realizando una peticion POST a addAgreement', async (done) => {
        const api = testData.url + 'users/1/agreements';
        postDataFromApi(api,testData.data.newAgreements).then(data => {
            expect('Acuerdo creado.').toBe(data.message);
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
    test('Realizando una peticion  a updateStatusAgreement', async (done) => {
        const api = testData.url + 'users/1/agreements/status';
        putDataFromApi(api,testData.data.newAgreementsStatus).then(data => {
            expect('Estatus actualizado.').toBe(data.message);
            done();
        });
    });
    test('Realizando una peticion a getAgreeByGroup', async (done) => {
        const api = testData.url + 'agreement/group/1';
        getDataFromApi(api).then(data => {
            expect(data.agreements.length).toBeGreaterThanOrEqual(1);
            done();
        });
    });
});
