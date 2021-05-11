const express = require('express')
const PropertiesReader = require('properties-reader')

const userController = require('../controllers/usersController')

const properties = PropertiesReader('./src/bin/common.properties')

const uriUserByAssociatedGroups = properties.get('routes.api.users')
const uriUsersForGroupId = properties.get('routes.api.usersByGroupId')
const uriUser = properties.get('routes.api.user')
const uriUserByEmail = properties.get('routes.api.userByEmail')
const uriUserById = properties.get('routes.api.userById')
const uriOrgByUser = properties.get('routes.api.orgbyuser')
const uriUserByorg = properties.get('routes.api.userbyorg')
const uriRolByUser = properties.get('routes.api.userRolByGroup')
const uriStatusByUser = properties.get('routes.api.userStatus')
const uriUpdatePasswordByUser = properties.get('routes.api.updatePasswordByUser')
const uriUpdateStatusByUser = properties.get('routes.api.updateStatusByUser')
const uriResetPasswordByUser = properties.get('routes.api.resetPasswordByUser')
const uriUserbyorgName = properties.get('routes.api.userbyorgName')
const uriUserLogin = properties.get('routes.api.userLogin')
const uriUserToken = properties.get('routes.api.userToken')
const uriUserAndRoll = properties.get('routes.api.userAndRoll')
const uriUserAllActByOrg = properties.get('routes.api.alluseractbyorg')
const userRouter = express.Router()


userRouter.route(uriUserByAssociatedGroups)
  .get(userController.getAllByAssociatedGroups)

userRouter.route(uriUsersForGroupId)
  .get(userController.getAllByGroupId)

userRouter.route(uriUserByEmail)
  .get(userController.getUserByemail)

userRouter.route(uriUserById)
  .get(userController.getUserById)
  .put(userController.userUpdate)

userRouter.route(uriUser)
  .post(userController.addUser)
  .get(userController.getAllUser)

userRouter.route(uriOrgByUser)
  .get(userController.getOrgbyIdUser)

userRouter.route(uriUserByorg)
  .get(userController.getAllUserByOrg)

userRouter.route(uriRolByUser)
  .get(userController.getRolByUser)

userRouter.route(uriStatusByUser)
  .get(userController.getStatusByUser)

userRouter.route(uriUpdatePasswordByUser)
  .get(userController.updatePasswordByEmail)

userRouter.route(uriUpdateStatusByUser)
  .get(userController.updateStatusByUser)

userRouter.route(uriResetPasswordByUser)
  .post(userController.resetPasswordByUser)

userRouter.route(uriUserbyorgName)
  .get(userController.getAllUserByOrgName)

userRouter.route(uriUserLogin)
  .post(userController.userLogin)

userRouter.route(uriUserToken)
  .post(userController.checkToken)

userRouter.route(uriUserAndRoll)
  .get(userController.getAllByRolAndUser)

userRouter.route(uriUserAllActByOrg)
  .get(userController.getAllUserActByOrg)  
  

    

module.exports = userRouter
