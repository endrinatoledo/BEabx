const express = require('express')
const PropertiesReader = require('properties-reader')
const properties = PropertiesReader('./src/bin/common.properties')
const meetingController = require('../controllers/meetingController')
const uriMeeting = properties.get('routes.api.meeting')
const uriMeetings = properties.get('routes.api.meetings')
const uriMeeNextStatus = properties.get('routes.api.updateMeetingPrecloser')
const uirMeetingsUsers = properties.get('routes.api.meetingusers')
const uriMeetingsByGroup = properties.get('routes.api.meetingsByGroup')
const uriPaticipantByMeeting = properties.get('routes.api.paticipantbymeeting')


const uriOrderedMeetingsByGroup = properties.get('routes.api.orderedMeetingsByGroup');
const uriOrderedDataByMeeting = properties.get('routes.api.orderedDataByMeeting');
const uriMeeCloser = properties.get('routes.api.closemeeting')
const meetingsRouter = express.Router()

meetingsRouter.route(uriMeetings)
  .get(meetingController.getAllMeeting)
  .post(meetingController.addMeeting)

meetingsRouter.route(uriMeeting)
  .get(meetingController.getMeeting)
  .put(meetingController.updateMeeting)
  .delete(meetingController.deleteMeeting)


// Cambio de estatus de las reuniones
meetingsRouter.route(uriMeeNextStatus)
  .put(meetingController.updateMeetingPrecloser)

meetingsRouter.route(uirMeetingsUsers)
  .get(meetingController.getUsersByMeeting)

meetingsRouter.route(uriMeetingsByGroup)
  .get(meetingController.getMeetingsByGroup)

meetingsRouter.route(uriOrderedMeetingsByGroup)
  .put(meetingController.updateOrderPositionByMeeting)
// .put(meetingController.orderedEntityMeetingById)
// .put(meetingController.orderedMeetingById)

meetingsRouter.route(uriOrderedDataByMeeting)
  .get(meetingController.getOrderPositionByMeeting)
// .get(meetingController.getOrderedMeetingByEntity)
// .get(meetingController.getOrderedMeetingById)


meetingsRouter.route(uriPaticipantByMeeting)
  .get(meetingController.getPaticipantByMeeting)

meetingsRouter.route(uriMeeCloser)   
  .put(meetingController.updateMeetingCloser)

module.exports = meetingsRouter
