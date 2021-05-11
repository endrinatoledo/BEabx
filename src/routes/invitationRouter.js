const express = require('express')
const PropertiesReader = require('properties-reader')

const properties = PropertiesReader('./src/bin/common.properties')

const invitationController = require('../controllers/invitationController')

const uriInvitation = properties.get('routes.api.invitation')
const uriInvitations = properties.get('routes.api.invitations')
const uriInvitationByEmail = properties.get('routes.api.invitationByemail')
const uriInvitationChangeStatus = properties.get('routes.api.invitationChangeStatus')

const invitationsRouter = express.Router()

invitationsRouter.route(uriInvitationByEmail)
  .get(invitationController.getInvitationsByemail)
  .delete(invitationController.deleteInvitations)

invitationsRouter.route(uriInvitations)
  .get(invitationController.getAllInvitations)

invitationsRouter.route(uriInvitation)
  .get(invitationController.getInvitations)
  .post(invitationController.addInvitations)

  invitationsRouter.route(uriInvitationChangeStatus)
  .get(invitationController.updateInvitations)
 
module.exports = invitationsRouter
