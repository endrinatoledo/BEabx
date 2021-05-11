const express = require('express')
const PropertiesReader = require('properties-reader')

const assignmentController = require('../controllers/assignmentController')
const commentsController = require('../controllers/commentsController')

const properties = PropertiesReader('./src/bin/common.properties')

const assignmentRouter = express.Router()

const uriAssignment = properties.get('routes.api.assignment')
const uriAsmNextStatus = properties.get('routes.api.asmNextStatus')
const uriAssignmentByGroup = properties.get('routes.api.assignmentbygroup')
const uriAssignmentComment= properties.get('routes.api.assignmentComment')
const uriCommentByAssignment= properties.get('routes.api.commentByAssignment')
const uriAssignByRolGroup= properties.get('routes.api.groupassignbyrol')
const uriAssignByUser= properties.get('routes.api.assignmentsbyuser')
const uriNotesByGroup= properties.get('routes.api.notesByGroup')
const uriAssignmentByMeeting= properties.get('routes.api.asmByMeeting')

assignmentRouter.route(uriAsmNextStatus)
  .get(assignmentController.getNextStatus)

assignmentRouter.route(uriAssignment)
  .get(assignmentController.getAllByUser)
  .post(assignmentController.addAssignment)
  .put(assignmentController.updateAssignment)
  .delete(assignmentController.notImplementedOperation)

assignmentRouter.route(`${uriAssignment}/comments`)
  .post(commentsController.addComments)
  .put(commentsController.updateComments)
  .delete(commentsController.deleteComments)
  .get(commentsController.getComments)

/* Cambio de estatus de las asignaciones */
assignmentRouter.route(`${uriAssignment}/status`)
  .put(assignmentController.updateStatusAssignment)
  .get(assignmentController.notImplementedOperation)
  .post(assignmentController.notImplementedOperation)
  .delete(assignmentController.notImplementedOperation)

assignmentRouter.route(`${uriAssignment}/status/:id_status`)
  .get(assignmentController.getAllByStatus)
  .put(assignmentController.notImplementedOperation)
  .post(assignmentController.notImplementedOperation)
  .delete(assignmentController.notImplementedOperation)

assignmentRouter.route(`${uriAssignment}/groups`)
  .get(assignmentController.getAllByUserGroup)
  .post(assignmentController.notImplementedOperation)
  .put(assignmentController.notImplementedOperation)
  .delete(assignmentController.notImplementedOperation)

assignmentRouter.route(`${uriAssignment}/groups/:id_groups`)
  .get(assignmentController.getAllByGroup)
  .post(assignmentController.notImplementedOperation)
  .put(assignmentController.notImplementedOperation)
  .delete(assignmentController.notImplementedOperation)

assignmentRouter.route(`${uriAssignment}/participants/:id_participants`)
  .get(assignmentController.getAllByParticipants)
  .post(assignmentController.notImplementedOperation)
  .put(assignmentController.notImplementedOperation)
  .delete(assignmentController.notImplementedOperation)

  assignmentRouter.route(uriAssignmentByGroup)
  .get(assignmentController.getAssiByGroup)
  
  assignmentRouter.route(uriAssignmentComment)
  .post(commentsController.addComments)

  assignmentRouter.route(uriCommentByAssignment)
  .get(commentsController.getCommentsByAssignment)

  assignmentRouter.route(uriAssignByRolGroup)
      .get(assignmentController.getAssigmentsByRol)

  assignmentRouter.route(uriAssignByUser)
      .get(assignmentController.getAssigmentsByUser)

  assignmentRouter.route(uriNotesByGroup)
      .get(assignmentController.getNotesByGroup)

  assignmentRouter.route(uriAssignmentByMeeting)
      .get(assignmentController.getAssiByMeeting)

module.exports = assignmentRouter
