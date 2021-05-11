const express = require('express')
const PropertiesReader = require('properties-reader')

const groupsController = require('../controllers/groupsController')

const properties = PropertiesReader('./src/bin/common.properties')

const groupsRouter = express.Router()

const uriGroups = properties.get('routes.api.groups')
const uriUsersGroups = properties.get('routes.api.groupsusers')
const uriGroupByOrg = properties.get('routes.api.groupsusersorg')
const uriGroupPart = properties.get('routes.api.groupspart')
const uriGroupByUser = properties.get('routes.api.groupByuser')
const uriGroupdelete = properties.get('routes.api.groupdelete')
const uriGroupDeletePart = properties.get('routes.api.groupdeletepart')
const uriLeaderByGroup = properties.get('routes.api.leaderBygroup')
const uriGroupById = properties.get('routes.api.groupbyid')
const uriGroupsByUserandOrg = properties.get('routes.api.groupbyuserandorg')
const uriGroupParticipants = properties.get('routes.api.groupparticipants')
const uriGroupMembershipGroup = properties.get('routes.api.membershipGroup')
const uriActivateMembershipGroup = properties.get('routes.api.activateMembershipGroup')
const uriGroupStatistics = properties.get('routes.api.groupstatistics')

groupsRouter.route(uriGroupById)
  .get(groupsController.getGroupById)


groupsRouter.route(uriGroups)
  .get(groupsController.getAll)
  .post(groupsController.addGroups)
  .put(groupsController.updateGroups)
  .delete(groupsController.deleteGroups)

groupsRouter.route(uriUsersGroups)
  .get(groupsController.getAllByUser);

groupsRouter.route(uriGroupByOrg)
  .get(groupsController.getGroupByOrg);

groupsRouter.route(uriGroupPart)
  .post(groupsController.addParticipant)

/*Crea el grupo y se identifica el lider*/
groupsRouter.route(uriGroupByUser)
  .post(groupsController.addGroupByUser);

groupsRouter.route(uriGroupdelete)
  .delete(groupsController.deleteGroup);

groupsRouter.route(uriGroupDeletePart)
  .delete(groupsController.deletePartGroup)

groupsRouter.route(uriLeaderByGroup)
  .get(groupsController.getLeaderByGroup);

groupsRouter.route(uriGroupsByUserandOrg)
  .get(groupsController.getGroupByUserOrg)

groupsRouter.route(uriGroupParticipants)
  .get(groupsController.getGroupParticipants)

groupsRouter.route(uriGroupMembershipGroup)
  .post(groupsController.membershipGroup);

groupsRouter.route(uriActivateMembershipGroup)
  .get(groupsController.activateMembershipGroup)

groupsRouter.route(uriGroupStatistics)
    .get(groupsController.getStatisticsByGroup)


module.exports = groupsRouter
