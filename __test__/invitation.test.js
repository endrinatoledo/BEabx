const {getDataFromApi,postDataFromApi,putDataFromApi,deleteDataFromApi} = require('./getDataFromApi');
const testData = require('./testData');

describe('Probando invitationController', () => {
    test('Realizando una peticion POST a addInvitations', async (done) => {
        const api = testData.url + 'invitation';
        postDataFromApi(api,testData.data.newInvitation).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });
    test('Realizando una peticion  a getAllInvitations', async (done) => {
        const api = testData.url + 'invitations';
        getDataFromApi(api).then(data => {
            expect(data.invitations.length).toBeGreaterThanOrEqual(1);
            done();
        });
    });
    test('Realizando una peticion POST a addInvitations', async (done) => {
        const api = testData.url + 'invitation';
        postDataFromApi(api,testData.data.newInvitation).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });
    test('Realizando una peticion  a getInvitationsByemail', async (done) => {
        const api = testData.url + 'invitation/mgoncalvez2@intelix.biz';
        getDataFromApi(api).then(data => {
            expect(data.invitation).not.toBeNull();
            done();
        });
    });
    test('Realizando una peticion DELETE a deleteInvitations', async (done) => {
        const api = testData.url + 'invitation/mgoncalvez2@intelix.biz';
        deleteDataFromApi(api).then(data => {
            expect('configuracion  eliminada exitosamente').toBe(data.message);
            done();
        });
    });
});