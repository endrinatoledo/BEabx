const {getDataFromApi} = require('./getDataFromApi');
const testData = require('./testData');

describe('Probando domainController', () => {
    test('Realizando una peticion  a fechAll', async (done) => {
        const api = testData.url + 'domains';
        getDataFromApi(api).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });
});
