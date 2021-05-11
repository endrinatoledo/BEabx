const {getDataFromApi,postDataFromApi,deleteDataFromApi} = require('./getDataFromApi');
const testData = require('./testData');

describe('Probando meetingController', () => {
    test('Realizando una peticion a getAllMeeting', async (done) => {
        const api = testData.url + 'meetings';
        getDataFromApi(api).then(data => {
            expect(data.meeting.length).toBeGreaterThanOrEqual(1);
            done();
        });
    });
    test('Realizando una peticion a getMeeting', async (done) => {
        const api = testData.url + 'meeting/1';
        getDataFromApi(api).then(data => {
            expect('Exitoso').toBe(data.message);
            done();
        });
    });
    /*
    test('Realizando una peticion  a deleteMeeting', async (done) => {
        const api = testData.url + 'meeting/3';
        deleteDataFromApi(api).then(data => {
            console.log(data)
            done();
        });
    });

    test('Realizando una peticion POST a addMeeting', async (done) => {
        const api = testData.url + 'meetings';
        postDataFromApi(api,testData.data.newMeeting).then(data => {
            console.log(data)
            done();
        });
    });*/
});
