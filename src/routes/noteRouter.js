const express = require('express');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./src/bin/common.properties');
const noteController = require('../controllers/noteController');
const uriNote = properties.get('routes.api.notes');
const uriNotePost = properties.get('routes.api.note');
const uriNoteById = properties.get('routes.api.noteChange')
const noteRouter = express.Router()

noteRouter.route(uriNote)
  .get(noteController.getAllNote)

noteRouter.route(uriNotePost)
  .post(noteController.createNote)

noteRouter.route(uriNoteById)
  .get(noteController.getNoteById)
  .put(noteController.updateNoteById)
  .delete(noteController.deleteNoteById)

module.exports = noteRouter;
