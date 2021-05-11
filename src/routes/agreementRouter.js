const express = require('express')
const PropertiesReader = require('properties-reader')

const agreementController = require('../controllers/agreementController')
const commentsController = require('../controllers/commentsController')


const agreementRouter = express.Router()

const properties = PropertiesReader('./src/bin/common.properties')

const uriAgreement = properties.get('routes.api.agreement')
const uriAsmNextStatus = properties.get('routes.api.agrNextStatus')
const uriAgreementByGroup = properties.get('routes.api.agreementbygroup')
const uriAgreementByRol = properties.get('routes.api.agreementbyrol')
const uriAgreementChangeStatus = properties.get('routes.api.agreementsChangeStatus')
const uriAgrByMeeting = properties.get('routes.api.agrByMeeting')


agreementRouter.route(uriAsmNextStatus)
  .get(agreementController.getNextStatus)
  .post(agreementController.notImplementedOperation)
  .put(agreementController.notImplementedOperation)
  .delete(agreementController.notImplementedOperation)

agreementRouter.route(uriAgreement)
  .get(agreementController.getAllByUser)
  .post(agreementController.addAgreement)
  .put(agreementController.updateAgreement)
  .delete(agreementController.notImplementedOperation)

agreementRouter.route(`${uriAgreement}/comments`)
  .get(commentsController.getComments)
  .post(commentsController.addComments)
  .put(commentsController.updateComments)
  .delete(commentsController.deleteComments)

// Cambio de estatus de las asignaciones
agreementRouter.route(`${uriAgreement}/status`)
  .put(agreementController.updateStatusAgreement)
  .get(agreementController.notImplementedOperation)
  .post(agreementController.notImplementedOperation)
  .delete(agreementController.notImplementedOperation)

agreementRouter.route(`${uriAgreement}/groups`)
  .get(agreementController.getAllByUserGroup)
  .post(agreementController.notImplementedOperation)
  .put(agreementController.notImplementedOperation)
  .delete(agreementController.notImplementedOperation)

agreementRouter.route(uriAgreementByGroup)
  .get(agreementController.getAgreeByGroup)

agreementRouter.route(uriAgreementByRol)
    .get(agreementController.getAgreeByRol)

agreementRouter.route(uriAgrByMeeting)
    .get(agreementController.getAgrementByMeeId)  


module.exports = agreementRouter
