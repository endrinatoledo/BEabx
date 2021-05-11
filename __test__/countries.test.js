

const {getDataFromApi} = require('./getDataFromApi');
const testData = require('./testData');

describe('Probando countriesController', () => {
    test('Realizando una peticion  a fetchAll', async (done) => {
        const api = testData.url + 'countries';
        getDataFromApi(api).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });
});
