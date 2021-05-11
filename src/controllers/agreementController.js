const HttpStatus = require('http-status-codes')
const PropertiesReader = require('properties-reader')
const Sequelize = require('sequelize')

const models = require('../models')

const properties = PropertiesReader('./src/bin/common.properties')
const Op = Sequelize.Op

// Main controller functionalities
function addAgreement(req, res, next) {
  let message
  let status
  const AGR_STA = 'agr_sta'
  let agrPosition;

  if (!req.body.title || !req.body.content || !req.body.oriId || !req.body.createDate || !req.body.meeId || !req.body.grpId) return res.status(406).json({ok: false, message: 'Los campos son obligatorios'});
  models.meetingPositionsModel.findAll({
    where: {meeId: req.body.meeId},
    attributes: [[Sequelize.fn('max', Sequelize.col('position')), 'maxPosition']]
  }).then(position => {
    agrPosition = position[0][`dataValues`][`maxPosition`] !== "undefined" || null ? Number(position[0][`dataValues`][`maxPosition`] + 1) : 1;
  }).catch(err => {
    throw err
  })
  models.variablesvaluesModel.findAll({
    where: {
      cod: AGR_STA,
      description: 'Pendiente'
    }
  })
    .then((variableValue) => {
      status = variableValue[0].value;
      models.usersrolatrModel.findOne({
        where: {
          grpId: req.body.grpId,
          rolId: {
            [Op.like]: '%1%'
          }
        }
      }).then((user) => {
        models.agreementModel.create({
          title: req.body.title,
          content: req.body.content,
          oriId: req.body.oriId,
          status: status,
          agrCreate: req.body.createDate,
          date: req.body.createDate,
          agrUpdate: req.body.updateDate,
          meeId: req.body.meeId,
          usrId: user.dataValues.usrId,
          grpId: req.body.grpId,
          usrIdCreator: req.params.id,
        }).then((agreements) => {
          models.meetingPositionsModel.create({
            meeId: req.body.meeId,
            agrId: agreements.dataValues.id,
            asmId: null,
            noeId: null,
            position: agrPosition
          }).then(resp => {
            message = properties.get('message.agr.res.okCreated')
            res.status(HttpStatus.OK).json({message, agreements})
          }).catch(err => {
            throw err
          })
        }, (err) => {
          message = properties.get('message.res.errorInternalServer')
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
          next(err)
        })
      }, (err) => {
        message = properties.get('message.res.errorInternalServer')
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
        next(err)
      })
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
}

function getAllByUser(req, res, next) {
  let message

  models.agreementModel.findAll({
    include: [{
      model: models.originModel,
      as: 'origin',
      attributes: []
    },
      {
        model: models.groupsModel,
        as: 'group',
        required: true,
        include: [{
          model: models.usersrolatrModel,
          as: 'usersrolatr',
          where: {usr_id: req.params.id},
          attributes: []
        }]
      },
      {
        model: models.userModel,
        as: 'user'
      }],
    order: [['agr_create_at', 'ASC']]
  })
    .then((agreements) => {
      if (agreements.length > 0) {
        message = properties.get('message.res.okData')
        res.status(HttpStatus.OK).json({message, agreements})
      } else {
        message = properties.get('message.agr.res.notData')
        res.status(HttpStatus.OK).json({message, agreements})
      }
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
}

function getAllByUserGroup(req, res, next) {
  let message
  let groupId = req.query.grpId

  if (!Array.isArray(groupId)) groupId = new Array(groupId)
  models.agreementModel.findAll({
    where: {
      usr_id: req.params.id,
      grp_id: {
        [Op.in]: groupId
      }
    },
    include: [{
      model: models.groupsModel,
      as: 'groups'
    },
      {
        model: models.originModel,
        as: 'origin'
      },
      {
        model: models.commentsModel,
        as: 'comments'
      }]
  })
    .then((agreements) => {
      if (agreements.length > 0) {
        message = properties.get('message.res.okData')
        res.status(HttpStatus.OK).json({message, agreements})
      } else {
        message = properties.get('message.agr.res.notData')
        res.status(HttpStatus.OK).json({message, agreements})
      }
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
}

function getNextStatus(req, res, next) {
  let message
  const AGR_STA = 'agr_sta'
  const AGR_APR = 'agr_act'
  models.agreementModel.findOne({
      attributes: ['agr_status'],
      where: {
        agr_id: req.params.id
      }
    }
    /*  models.variablesvaluesModel.findAll({
        required: true,
        include: [{
          model: models.agreementModel,
          as: 'agreement',
          where: {
            agr_id: req.params.id
          }
        }],
        where: {
          vva_cod: AGR_STA
        }
      }*/
  ).then((data) => {
      models.variablesvaluesModel.findAll({
        where: {
          vva_cod: AGR_APR,
          // vva_value: data[0].value
          vva_value: data.dataValues.agr_status
        }
      }).then((variableValue) => {
        message = properties.get('message.agr.res.okData')
        res.status(HttpStatus.OK).json({message, variableValue})
      }, (err) => {
        message = properties.get('message.res.errorInternalServer')
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
        next(err)
      })
    },
    (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
}

function updateAgreement(req, res, next) {
  let message

  models.agreementModel.findOne({
    where: {
      agrId: req.body.agrId
    }
  })
    .then((agreements) => {
      if (agreements) {
        agreements.update({
          agrTitle: (req.body.agrTitle != null && req.body.agrTitle !== '') ? req.body.agrTitle : agreements.agrTitle,
          agrContent: (req.body.agrContent != null && req.body.agrContent !== '') ? req.body.agrContent : agreements.agrContent,
          oriId: (req.body.oriId != null && req.body.oriId !== '') ? req.body.oriId : agreements.oriId,
          agrStatus: (req.body.agrStatus != null && req.body.agrStatus !== '') ? req.body.agrStatus : agreements.agrStatus,
          agrCreate: (req.body.createDate != null && req.body.createDate !== '') ? req.body.createDate : agreements.agrCreate,
          agrUpdate: (req.body.updateDate != null && req.body.updateDate !== '') ? req.body.updateDate : agreements.agrUpdate,
          usrId: (req.body.usrId != null && req.body.usrId !== '') ? req.body.usrId : agreements.usrId,
          grpId: (req.body.grpId != null && req.body.grpId !== '') ? req.body.grpId : agreements.grpId
        })
          .then((agreements) => {
            message = properties.get('message.agr.res.agrUpdated')
            res.status(HttpStatus.OK).json({message, agreements})
          }, (err) => {
            message = properties.get('message.res.errorInternalServer')
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
            next(err)
          })
      } else {
        message = properties.get('message.asm.agr.notDataToUpdate')
        res.status(HttpStatus.NOT_FOUND).json({message})
      }
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
}

function updateStatusAgreement(req, res, next) {
  let message
  models.agreementModel.findOne({
    where: {
      id: req.body.id
    }
  })
    .then((agreements) => {
      if (agreements) {
        agreements.update({
          status: (req.body.status != null && req.body.status !== '') ? req.body.status : agreements.status
        })
          .then((agreements) => {
            message = properties.get('message.res.statusUpdated')
            res.status(HttpStatus.OK).json({message, agreements})
          }, (err) => {
            message = properties.get('message.res.errorInternalServer')
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
            next(err)
          })
      } else {
        message = properties.get('message.res.statusUpdated')
        res.status(HttpStatus.OK).json({message, agreements})
      }
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
}

function getAgreeByGroup(req, res, next) {
  let message

  models.agreementModel.findAll({
    include: [{
      model: models.originModel,
      as: 'origin',
      attributes: []
    },
      {
        model: models.groupsModel,
        as: 'group',
        required: true,
        where: {id: req.params.idGroup},
        include: [{
          model: models.usersrolatrModel,
          as: 'usersrolatr',
          attributes: []
        }]
      },
      {
        model: models.userModel,
        as: 'user'
      }],
    order: [['agr_create_at', 'ASC']]
  })
    .then((agreements) => {
      if (agreements.length > 0) {
        message = properties.get('message.res.okData')
        res.status(HttpStatus.OK).json({message, agreements})
      } else {
        message = properties.get('message.agr.res.notData')
        res.status(HttpStatus.OK).json({message, agreements})
      }
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
}

function getAgreeByRol(req, res, next) {
  let message
  let rol = req.params.rol === 'Leader' ? '1,2' : '3';
  models.agreementModel.findAll({
    include: [{
      model: models.originModel,
      as: 'origin',
      attributes: []
    },
      {
        model: models.groupsModel,
        as: 'group',
        required: true,
        include: [{
          model: models.usersrolatrModel,
          as: 'usersrolatr',
          where: {rol_id: rol, usr_id: req.params.id}
        }]
      },
      {
        model: models.userModel,
        as: 'user'
      }],
    order: [['agr_create_at', 'ASC']]
  })
    .then((agreements) => {
      if (agreements.length > 0) {
        message = properties.get('message.res.okData')
        res.status(HttpStatus.OK).json({message, agreements})
      } else {
        message = properties.get('message.agr.res.notData')
        res.status(HttpStatus.OK).json({message, agreements})
      }
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
}

async function getAgrementByMeeId(req, res, next) {
  let message
  let id = req.params.id

  models.agreementModel.findAll({
    required: true,
    include: [{
      model: models.meetingModel,
      as: 'meeting',
      where: {
        id
      }
    }, {
      model: models.userModel,
      as: 'user'
    }]
  })

    .then((agreements) => {
      if (agreements.length > 0) {
        message = properties.get('message.res.okData')
        res.status(HttpStatus.OK).json({message, agreements})
      } else {
        message = properties.get('message.agr.res.notData')
        res.status(HttpStatus.OK).json({message, agreements})
      }

    }, (err) => next(err))
    .catch((err) => next(err))
}


// Generic handler for not implemented operations
function notImplementedOperation(req, res) {
  res.sendStatus(HttpStatus.NOT_IMPLEMENTED)
}

module.exports = {
  addAgreement,
  getAllByUser,
  getAllByUserGroup,
  getNextStatus,
  updateAgreement,
  updateStatusAgreement,
  notImplementedOperation,
  getAgreeByGroup,
  getAgreeByRol,
  getAgrementByMeeId
}
