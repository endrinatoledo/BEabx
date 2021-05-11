const {getDataFromApi} = require('./getDataFromApi');
const testData = require('./testData');

describe('Probando organizationsController', () => {
    test('Realizando una peticion a fetchAll', async (done) => {
        const api = testData.url + 'organizations';
        getDataFromApi(api).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });
});
