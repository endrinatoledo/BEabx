const {getDataFromApi,postDataFromApi,putDataFromApi} = require('./getDataFromApi');
const testData = require('./testData');

describe('Probando assignmentController', () => {
    test('Realizando una peticion a getNextStatus', async (done) => {
        const api = testData.url + 'assignments/nextStatus/14';
        getDataFromApi(api).then(data => {
            expect(data.variableValue.length).toBeGreaterThanOrEqual(1);
            done();
        });
    });
    test('Realizando una peticion a getAllByUser', async (done) => {
        const api = testData.url + 'users/1/assignments';
        getDataFromApi(api).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });
    test('Realizando una peticion POST a addAssignment', async (done) => {
        const api = testData.url + 'users/1/assignments';
        postDataFromApi(api,testData.data.assignmentController).then(data => {
            expect('Asignacion creada.').toBe(data.message);           
            done();
        });
    });
    test('Realizando una peticion PUT a updateAssignment', async (done) => {
        const api = testData.url + 'users/1/assignments';
        putDataFromApi(api,testData.data.assignmentController).then(data => {
            expect('Asignacion actualizada.').toBe(data.message);           
            done();
        });
    });
    test('Realizando una peticion PUT a updateStatusAssignment', async (done) => {
        const api = testData.url + 'users/1/assignments/status';
        putDataFromApi(api,testData.data.assignmentController).then(data => {
            expect('Estatus actualizado.').toBe(data.message);           
            done();
        });
    });
    test('Realizando una peticion a getAllByStatus', async (done) => {
        const api = testData.url + 'users/1/assignments/status/1';
        getDataFromApi(api).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });
    test('Realizando una peticion a getAllByUserGroup', async (done) => {
        const api = testData.url + 'users/1/groups';
        getDataFromApi(api).then(data => {
            expect(data.groups.length).toBeGreaterThanOrEqual(1);
            done();
        });
    });
    test('Realizando una peticion a getAllByParticipants', async (done) => {
        const api = testData.url + 'users/1/assignments/participants/1';
        getDataFromApi(api).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });
    test('Realizando una peticion a getAssiByGroup', async (done) => {
        const api = testData.url + 'assignments/group/2';
        getDataFromApi(api).then(data => {
            expect(data.assignments.length).toBeGreaterThanOrEqual(1);
            done();
        });
    });
    test('Realizando una peticion a getCommentsByAssignment', async (done) => {
        const api = testData.url + 'users/1/assignments/1/comment';
        getDataFromApi(api).then(data => {
            expect(data).not.toBeNull();
            done();
        });
    });
});

