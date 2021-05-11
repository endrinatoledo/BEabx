const {getDataFromApi,postDataFromApi,putDataFromApi,deleteDataFromApi} = require('./getDataFromApi');
const testData = require('./testData');

describe('Probando groupsController', () => {
    test('Realizando una peticion  a getAll', async (done) => {
        const api = testData.url + 'groups';
        getDataFromApi(api).then(data => {
            expect(data.groups.length).toBeGreaterThanOrEqual(1);
            done();
        });
    });
    test('Realizando una peticion POST a addGroups', async (done) => {
        const api = testData.url + 'groups';
        postDataFromApi(api,testData.data.groupsController).then(data => {
            expect('Exitoso').toBe(data.message);
            done();
        });
    });
    test('Realizando una peticion POST a addParticipant', async (done) => {
        const api = testData.url + 'groups/participant';
        postDataFromApi(api,testData.data.newParticipart).then(data => {
            expect(data.user).not.toBeNull();
            done();
        });
    });
    test('Realizando una peticion  a getAllByUser', async (done) => {
        const api = testData.url + 'users/1/groups';
        getDataFromApi(api).then(data => {
            expect(data.groups.length).toBeGreaterThanOrEqual(1);
            done();
        });
    });
    test('Realizando una peticion  a getGroupByOrg', async (done) => {
        const api = testData.url + 'users/1/groups/org';
        getDataFromApi(api).then(data => {
            expect(data.groups.length).toBeGreaterThanOrEqual(1);
            done();
        });
    });
    test('Realizando una peticion  a getLeaderByGroup', async (done) => {
        const api = testData.url + 'group/leader/1';
        getDataFromApi(api).then(data => {
            expect(data.user).not.toBeNull();
            done();
        });
    });
     test('Realizando una peticion  a deletePartGroup', async (done) => {
            const api = testData.url + 'group/delete/10/1';
            deleteDataFromApi(api).then(data => {
                expect('Participante eliminado exitosamente').toBe(data.message);
                done();
            });
        });    
});
