const {getDataFromApi} = require('./getDataFromApi');
const testData = require('./testData');

describe('Probando originController', () => {
    test('Realizando una peticion  a getAllOrigin', async (done) => {
        const api = testData.url + 'origins';
        getDataFromApi(api).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });
});
