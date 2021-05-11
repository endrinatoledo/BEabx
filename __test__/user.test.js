const {getDataFromApi,postDataFromApi} = require('./getDataFromApi');
const testData = require('./testData');

describe('Probando usersController', () => {
    test('Realizando una peticion a getUserById', async (done) => {
        const api = testData.url + 'user/2';
        getDataFromApi(api).then(data => {
            expect('Exitoso').toBe(data.message);
            done();
        });
    });

    test('Realizando una peticion a getUserById y verificando el resultado ', async (done) => {
        const api = testData.url + 'user/2';
        getDataFromApi(api).then(data => {
            expect(testData.data.usersController[0]).toEqual(data.user);
            done();
        });
    });

    test('Realizando una peticion a getUserByemail y verificando el resultado', async (done) => {
        const api = testData.url + '/user/email/wsanchez@intelix.biz';
        getDataFromApi(api).then(data => {
            expect(testData.data.usersController[0]).toEqual(data.user);
            done();
        });
    });

    test('Realizando una peticion a getUserByemail y verificando el resultado', async (done) => {
        const api = testData.url + '/user/email/wsanchez@intelix.biz';
        getDataFromApi(api).then(data => {
            expect(testData.data.usersController[0]).toEqual(data.user);
            done();
        });
    });

    test('Realizando una peticion a getAllByAssociatedGroups', async (done) => {
        const api = testData.url + 'users/2';
        getDataFromApi(api).then(data => {
            expect('Exitoso').toBe(data.message);
            done();
        });
    });

    test('Realizando una peticion a usersByGroupId', async (done) => {
        const api = testData.url + 'users/groups/1';
        getDataFromApi(api).then(data => {
            expect('Exitoso').toBe(data.message);
            done();
        });
    });

    test('Realizando una peticion a getOrgbyIdUser', async (done) => {
        const api = testData.url + 'users/1/org';
        getDataFromApi(api).then(data => {
            expect('Exitoso').toBe(data.message);
            done();
        });
    });

    test('Realizando una peticion a getOrgbyIdUser y verificando el resultado', async (done) => {
        const api = testData.url + 'users/1/org';
        getDataFromApi(api).then(data => {
            expect(testData.data.employee).toEqual(data.employee);
            done();
        });
    });

     test('Realizando una peticion a getAllUserByOrg y verificando el resultado', async (done) => {
        const api = testData.url + 'users/org/1';
        getDataFromApi(api).then(data => {
            expect(testData.data.usersController.length).toBeGreaterThanOrEqual(1);
            done();
        });
    });

    test('Realizando una peticion a getAllUserByOrg y verificando el resultado', async (done) => {
        const api = testData.url + 'users/org/1';
        getDataFromApi(api).then(data => {
            expect(data.users.length).toBeGreaterThanOrEqual(1);
            done();
        });
    });
      
    test('Realizando una peticion a getRolByUser y verificando el resultado', async (done) => {
        const api = testData.url + 'user/rol/1/1';
        getDataFromApi(api).then(data => {
            expect(data.rol.rolId).toBe('1,2');
            done();
        });
    });
    
    test('Realizando una peticion a getStatusByUser y verificando el resultado', async (done) => {
        const api = testData.url + 'user/status/1';
        getDataFromApi(api).then(data => {
            expect(1).toEqual(data.status);
            done();
        });
    });
    
    test('Realizando una peticion a updatePasswordByEmail y verificando el resultado', async (done) => {
        const api = testData.url + 'user/status/1';
        getDataFromApi(api).then(data => {
            expect(1).toEqual(data.status);
            done();
        });
    });
    
    test('Realizando una peticion a addUser', async (done) => {
        const api = testData.url + 'user';
        postDataFromApi(api,testData.data.newUser).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });

    test('Realizando una peticion a resetPasswordByUser', async (done) => {
        const api = testData.url + 'user/restPassword/1';
        postDataFromApi(api,testData.data.newPassword).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });
});

