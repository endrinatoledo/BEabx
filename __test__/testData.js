url='http://localhost:3000/api/v1/'

data = {
    usersController : [
        {   
            id: 2,
            login: 'wsanchez@intelix.biz',
            firstName: 'Willian ',
            secondName: null,
            lastName: 'Sanchez',
            email: 'wsanchez@intelix.biz',
            birthDate: '1982-09-15',
            createdAt: '2019-12-19',
            updateAt: null,
            deleteAt: null,
            status: 1,
            img: null,
            password: null 
        },
        { 
            id: 1,
            login: 'rortega@intelix.biz',
            firstName: 'Richard',
            secondName: null,
            lastName: 'Ortega',
            email: 'rortega@intelix.biz',
            birthDate: '1975-10-01',
            createdAt: '2019-12-19',
            updateAt: null,
            deleteAt: null,
            status: 1,
            img: null,
            password: null 
        }
    ],
    commentsController : {
        description: 'descricion',
        createdAt: '2019-12-19',
        updatedAt:'2019-12-19',
        asmId: 1,
        agrId: 1,
    },
    employee:{ 
        empId: 1,
        usrId: 1,
        orgId: 1,
        posId: 1,
        empStatus: 1,
        createDate: '2019-12-19',
        updateDate: '2019-12-19' 
    },
    newUser :{ 
        login: 'rrortega2@intelix.biz',
        firstName: 'rortega2@intelix.biz',
        secondName: '',
        lastName: 'rortega2@intelix.biz',
        email: 'rortega2@intelix.biz',
        birthdate: '2018-12-24T04:00:00.000Z',
        password: 'rortega2@intelix.biz',
        idOrg: 1,
        grpId: 1 
    },
    newPassword :
    {
        password: '123',
        newPassword: '123'
    },
    agreementsController: [
        {
            id: 1,
            title: '1',
            content: '1',
            oriId: 1,
            status: 7,
            agrCreate: '2019-12-22',
            date: '2019-12-22',
            agrUpdate: '2019-12-22',
            meeId: 1,
            usrId: 1,
            grpId: 34,
            usrIdCreator: 1,
            group: {
                id: 34,
                name: '558888888',
                parentId: 1,
                description: '4',
                acronym: 'INTX',
                orgId: 1,
                img: null
            },
            user: {
                id: 1,
                login: 'rortega@intelix.biz',
                firstName: 'Richard',
                secondName: null,
                lastName: 'Ortega',
                email: 'rortega@intelix.biz',
                birthDate: '1975-10-01',
                createdAt: '2019-12-19',
                updateAt: null,
                deleteAt: null,
                status: 1,
                img: null,
                password: null
            }
        }
    ],
    newAgreements : {
        title: 'titulo',
        content: 'contienodo',
        oriId: 1,
        createDate: '1975-10-01',
        updateDate: '1975-10-01',
        grpId: 1,
    },

    updateAgreements : {
        agrTitle: 'titulo nuevo',
        agrContent: 'contenido nuevo',
        oriId: 1,
        agrStatus: '1975-10-01',
        agrCreate: '1975-10-01',
        agrUpdate: '1975-10-01',
        usrId: 1,
        grpId: 34,
        agrId:1,
        meeId:1
    },
    newAgreementsStatus : {
        agrStatus: 8,
        agrId: 1,
    },
    assignmentController : {
        title: 'titulo',
        content: 'contenido',
        initialDate: '1975-10-01',
        finalDate: '1975-10-01',
        grpId: 2,
        usrCreator: 1,
        usrId: 1,
        status:8,
        notification:1,
        id:1
    },
    groupsController : {
        name: 'Intelix222',
        parentId: 1,
        description: 'Intelix',
        acronym: 'INTX',
        orgId: 1,
        img: null,
        id:41
    },
    newParticipart : {
        userid:10,
        groupid:1,
        rolid:'2',
        urgstatus:1
    },
    newInvitation : {
        status: 1,
        email:'mgoncalvez2@intelix.biz',
        grpId:1,
        usrId:1
    },
    newMeeting :{
        title: 'poyecto2',
        date: '1975-10-01',
        grpId: 34,
        oriId: 1
    }
} 

module.exports = {
    url,
    data
}