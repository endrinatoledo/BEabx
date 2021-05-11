const HttpStatus = require('http-status-codes')
const PropertiesReader = require('properties-reader')
const Sequelize = require('sequelize')
let models = require('../models')
const properties = PropertiesReader(`./src/bin/common.properties`)
const Op = Sequelize.Op

function getInvitations(req, res, next) {
  models.invitationsModel.findOne({
    where: {
      invId: req.params.invId
    }
  }).then(invitation => {
      res.status(HttpStatus.OK).json({invitation})
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    }
  )
}

function getInvitationsByemail(req, res, next) {
  models.invitationsModel.findOne({
    where: {
      email: req.params.email
    }
  }).then(invitation => {
      res.status(HttpStatus.OK).json({invitation})
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    }
  )
}

function getAllInvitations(req, res, next) {
  models.invitationsModel.findAll({}).then(invitations => {
      res.status(HttpStatus.OK).json({invitations})
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    }
  )
}

function addInvitations(req, res, next) {
  models.invitationsModel.create({
    status: req.body.status,
    email: req.body.email,
    grpId: req.body.grpId,
    usrId: req.body.usrId
  }).then(invitation => {
      message = properties.get('message.con.res.okCreated')
      res.status(HttpStatus.OK).json({message, invitation})
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    }
  )
}

function deleteInvitations(req, res, next) {
  models.invitationsModel.destroy({
    where: {
      email: req.params.email
    }
  }).then((rowsDeleted) => {
    if (rowsDeleted > 0) {
      let message = "configuracion  eliminada exitosamente";
      res.status(HttpStatus.OK).json({message})
    } else {
      const err = new Error('No se pudo eliminar la configuracion')
      err.status = HttpStatus.NOT_FOUND

      return next(err)
    }
  }, (err) => next(err))
    .catch((err) => next(err))

}

function updateInvitations(req, res, next) {
  let message
  models.invitationsModel.findOne({
    where: {
      invId: req.params.invId
    }
  })
    .then(invitation => {
      if (invitation) {
        invitation.update({
          status: req.body.invStatus
        }).then((invitation) => {
          message = properties.get('message.res.okData')
          res.status(HttpStatus.OK).json({invitation})
        }, (err) => {
          message = properties.get('message.res.errorInternalServer')
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
          next(err)
        })
      } else {
        const err = new Error('No se encontra la invitation')
        err.status = HttpStatus.NOT_FOUND
        return next(err)
      }
    }, (err) => next(err))
    .catch((err) => next(err))
}

module.exports = {
  getInvitations,
  getAllInvitations,
  addInvitations,
  deleteInvitations,
  getInvitationsByemail,
  updateInvitations
}
