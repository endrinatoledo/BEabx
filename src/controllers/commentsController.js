const HttpStatus = require('http-status-codes')

const models = require('../models')

function addComments(req, res, next) {
  if (!req.body.updatedAt || !req.body.description) return res.status(406).json({ok: false, message: 'Los campos son obligatorios'});
  models.commentsModel.create({
    description: req.body.description,
    createdAt: Date.now(),
    updatedAt: req.body.updatedAt,
    asmId: (req.body.asmId != null) ? req.body.asmId : null,
    agrId: (req.body.agrId != null) ? req.body.agrId : null,
    usrId: req.params.id
  }).then((comments) => {
    res.status(HttpStatus.OK).json(comments)
  }, (err) => next(err))
    .catch((err) => next(err))
}

function deleteComments(req, res, next) {
  models.commentsModel.destroy({
    where: {
      usrId: req.params.id,
      asmId: (req.body.asmId != null) ? req.body.asmId : null,
      agrId: (req.body.agrId != null) ? req.body.agrId : null,
      comId: req.body.comId
    }
  }).then((rowsDeleted) => {
    if (rowsDeleted > 0) {
      res.status(HttpStatus.OK).json('Comentario eliminado exitosamente')
    } else {
      const err = new Error('No se pudo eliminar el comentario')

      err.status = HttpStatus.NOT_FOUND
      return next(err)
    }
  }, (err) => next(err))
    .catch((err) => next(err))
}

function getComments(req, res, next) {
  models.commentsModel.findAll({
    where: {
      asmId: (req.body.asmId != null) ? req.body.asmId : null,
      agrId: (req.body.agrId != null) ? req.body.agrId : null
    }
  }).then((comments) => {
    res.status(HttpStatus.OK).json(comments)
  }, (err) => next(err))
    .catch((err) => next(err))
}

function updateComments(req, res, next) {
  models.commentsModel.findOne({
    where: {
      asmId: (req.body.asmId != null) ? req.body.asmId : null,
      agrId: (req.body.agrId != null) ? req.body.agrId : null,
      usrId: req.params.id
    }
  }).then((comments) => {
    models.commentsModel.update({
      comDescription: (req.body.comDescription != null) ? req.body.comDescription : comments.comDescription,
      updatedAt: Date.now()
    }).then((comments) => {
      res.status(HttpStatus.OK).json(comments)
    }, (err) => next(err))
      .catch((err) => next(err))
  }, (err) => next(err))
    .catch((err) => next(err))
}

function getCommentsByAssignment(req, res, next) {
  models.commentsModel.findAll({
    where: {
      asmId: (req.params.idAssig != null) ? req.params.idAssig : null
    },
    include: [{
      model: models.userModel,
      as: 'users',
      required: true,


    }]
  }).then((comments) => {

    res.status(HttpStatus.OK).json(comments)
  }, (err) => next(err))
    .catch((err) => next(err))
}

module.exports = {
  addComments,
  deleteComments,
  getComments,
  updateComments,
  getCommentsByAssignment
}
