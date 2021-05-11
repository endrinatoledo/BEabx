const HttpStatus = require('http-status-codes')
const PropertiesReader = require('properties-reader')
const Sequelize = require('sequelize')

const models = require('../models')

const Op = Sequelize.Op
const properties = PropertiesReader('./src/bin/common.properties')

// Main controller functionalities
function addAssignment(req, res, next) {
  let message
  let status
  let asmPosition;
  const ASM_STA = 'asm_sta'
  if (!req.body.title || !req.body.content || !req.body.grpId || !req.body.meeId || !req.body.initialDate) return res.status(406).json({ok: false, message: 'Los campos son requeridos'})
  models.meetingPositionsModel.findAll({
    where: {meeId: req.body.meeId},
    attributes: [[Sequelize.fn('max', Sequelize.col('position')), 'maxPosition']]
  }).then(position => {
    asmPosition = position[0][`dataValues`][`maxPosition`] !== "undefined" || null ? Number(position[0][`dataValues`][`maxPosition`] + 1) : 1;
  }).catch(err => {
    throw err
  })
  models.variablesvaluesModel.findAll({
    where: {
      vva_cod: ASM_STA,
      vva_description: (req.body.usrId != null) ? 'Activa' : 'Pendiente'
    }
  }).then((variableValue) => {
    status = variableValue[0].id
    models.assignmentsModel.create({
      title: req.body.title,
      content: req.body.content,
      initialDate: req.body.initialDate,
      finalDate: req.body.finalDate,
      status: status,
      grpId: req.body.grpId,
      usrCreator: req.params.id,
      usrId: req.body.usrId.id,
      notification: req.body.notification,
      meeId: req.body.meeId
    }).then((assignments) => {
      models.meetingPositionsModel.create({
        meeId: Number(req.body.meeId),
        agrId: null,
        asmId: assignments.dataValues.id,
        noeId: null,
        position: asmPosition
      }).then(resp => {
        message = properties.get('message.asm.res.okCreated')
        res.status(HttpStatus.OK).json({message, assignments})
      }).catch(err => {
        throw err
      })
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      console.log(err)
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

  models.assignmentsModel.findAll({
    include: [{
      model: models.groupsModel,
      as: 'group',
      required: true,
      include: [{
        model: models.usersrolatrModel,
        as: 'usersrolatr',
        where: {usr_id: req.params.id},
        attributes: []
      }]
    }, {
      model: models.userModel,
      as: 'user'
    }],
    order: [['asm_finaldate', 'ASC']]

  }).then((assignments) => {
    if (assignments.length > 0) {
      message = properties.get('message.res.okData')
      res.status(HttpStatus.OK).json({message, assignments})
    } else {
      message = properties.get('message.asm.res.notData')
      res.status(HttpStatus.OK).json({message, assignments})
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

  models.assignmentsModel.findAll({
    where: {
      [Op.or]: [{
        usr_creator: {[Op.eq]: req.params.id}
      },
        {
          usr_id: {[Op.eq]: req.params.id}
        }],
      grp_id: {
        [Op.in]: groupId
      }
    },
    include: [{
      model: models.groupsModel,
      as: 'groups',
      atributes: {
        include: [{
          model: models.usersrolatrModel,
          as: 'usersrolatr'
        }]
      }
    }]
  })
    .then((assignments) => {
      if (assignments.length > 0) {
        message = properties.get('message.res.okData')
        res.status(HttpStatus.OK).json({message, assignments})
      } else {
        message = properties.get('message.asm.res.notData')
        res.status(HttpStatus.OK).json({message, assignments})
      }
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

      next(err)
    })
}

function getAllByStatus(req, res, next) {
  let message
  models.assignmentsModel.findAll({
    where: {
      [Op.or]: [{
        usrCreator: {[Op.eq]: req.params.id}
      },
        {
          usrId: {[Op.eq]: req.params.id}
        }],
      status: req.params.id_status
    }
  })
    .then((assignments) => {
      if (assignments.length > 0) {
        message = properties.get('message.res.okData')
        res.status(HttpStatus.OK).json({message, assignments})
      } else {
        message = properties.get('message.asm.res.notData')
        res.status(HttpStatus.OK).json({message, assignments})
      }
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

      next(err)
    })
}

function getAllByGroup(req, res, next) {
  let message

  models.assignmentsModel.findAll({
    where: {
      [Op.or]: [{
        usr_creator: {[Op.eq]: req.params.id}
      },
        {
          usr_id: {[Op.eq]: req.params.id}
        }],
      grp_id: req.params.id_groups
    },
    include: [{
      model: models.groupsModel,
      as: 'groups'
    }, {
      model: models.commentsModel,
      as: 'comments'
    }]
  })
    .then((assignments) => {
      if (assignments.length > 0) {
        message = properties.get('message.res.okData')
        res.status(HttpStatus.OK).json({message, assignments})
      } else {
        message = properties.get('message.asm.res.notData')
        res.status(HttpStatus.OK).json({message, assignments})
      }
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
}

function getAllByParticipants(req, res, next) {
  let message

  models.assignmentsModel.findAll({
    where: {
      usrCreator: req.params.id,
      usrId: req.params.id_participants
    }
  })
    .then((assignments) => {
      if (assignments.length > 0) {
        message = properties.get('message.res.okData')
        res.status(HttpStatus.OK).json({message, assignments})
      } else {
        message = properties.get('message.asm.res.notData')
        res.status(HttpStatus.OK).json({message, assignments})
      }
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

      next(err)
    })
}

function getNextStatus(req, res, next) {
  let message

  const ASM_STA = 'asm_sta'
  const ASM_ACT = 'asm_act'
  models.variablesvaluesModel.findAll({
    required: true,
    include: [{
      model: models.assignmentsModel,
      as: 'assignments',
      where: {
        asm_id: req.params.id
      }
    }],
    where: {
      vva_cod: ASM_STA
    }
  }).then((data) => {

      models.variablesvaluesModel.findAll({
        where: {
          vva_cod: ASM_ACT,
        }
      }).then((variableValue) => {
        message = properties.get('message.asm.res.okData')
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

function updateAssignment(req, res, next) {
  let message
  models.assignmentsModel.findOne({
    where: {
      id: req.body.id
    }
  })
    .then((assignments) => {
      if (assignments) {
        assignments.update({
          title: (req.body.title != null && req.body.title !== '') ? req.body.title : assignments.title,
          content: (req.body.content != null && req.body.content !== '') ? req.body.content : assignments.content,
          initialDate: (req.body.initialDate != null && req.body.initialDate !== '') ? req.body.initialDate : assignments.initialDate,
          finalDate: (req.body.finalDate != null && req.body.finalDate !== '') ? req.body.finalDate : assignments.finalDate,
          status: (req.body.status != null && req.body.status !== '') ? req.body.status : assignments.status,
          grpId: (req.body.grpId != null && req.body.grpId !== '') ? req.body.grpId : assignments.grpId,
          usrId: (req.body.usrId != null && req.body.usrId !== '') ? req.body.usrId : assignments.usrId
        })
          .then((assignments) => {
              message = properties.get('message.asm.res.asmUpdated')
              res.status(HttpStatus.OK).json({message, assignments})
            }, (err) => {
              message = properties.get('message.res.errorInternalServer')
              res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

              next(err)
            }
          )
      } else {
        message = properties.get('message.asm.res.notDataToUpdate')
        res.status(HttpStatus.NOT_FOUND).json({message})
      }
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

      next(err)
    })
}

function updateStatusAssignment(req, res, next) {
  let message
  models.assignmentsModel.findOne({
    where: {
      id: req.body.id
    }
  })
    .then((assignments) => {
      if (assignments) {
        assignments.update({
          status: (req.body.status != null && req.body.status !== '') ? req.body.status : assignments.status
        })
          .then((assignments) => {
            message = properties.get('message.res.statusUpdated')
            res.status(HttpStatus.OK).json({message, assignments})
          }, (err) => {
            message = properties.get('message.res.errorInternalServer')
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

            next(err)
          })
      } else {
        message = properties.get('message.res.asm.notDataToUpdate')
        res.status(HttpStatus.NOT_FOUND).json({message})
      }
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

      next(err)
    })
}

function getAssiByGroup(req, res, next) {
  let message

  models.assignmentsModel.findAll({
    include: [{
      model: models.groupsModel,
      as: 'group',
      required: true,
      where: {id: req.params.idGroup},
      include: [{
        model: models.usersrolatrModel,
        as: 'usersrolatr',
        attributes: []
      }]
    }, {
      model: models.userModel,
      as: 'user'
    }],
    order: [['asm_finaldate', 'ASC']]

  }).then((assignments) => {
    if (assignments.length > 0) {
      message = properties.get('message.res.okData')
      res.status(HttpStatus.OK).json({message, assignments})
    } else {
      message = properties.get('message.asm.res.notData')
      res.status(HttpStatus.OK).json({message, assignments})
    }
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })
}

// Generic handler for not implemented operations
function notImplementedOperation(req, res, next) {
  res.sendStatus(HttpStatus.NOT_IMPLEMENTED)
}

function getAssigmentsByRol(req, res) {
  let rol = req.params.rol === 'Leader' ? '1,2' : '3';
  models.assignmentsModel.findAll({
    include: [{
      model: models.groupsModel,
      as: 'group',
      required: true,
      include: {
        model: models.usersrolatrModel,
        as: 'usersrolatr',
        where: {rol_id: rol, usr_id: req.params.id}
      }
    }, {
      model: models.userModel,
      as: 'user'
    }],
    order: [['asm_finaldate', 'ASC']]
  })
    .then((assignments) => {
      // res.status(HttpStatus.OK).json({ message:'ok', assignments })
      if (assignments.length > 0) {
        message = properties.get('message.res.okData')
        res.status(HttpStatus.OK).json({message, assignments})
      } else {
        message = properties.get('message.asm.res.notData')
        res.status(HttpStatus.OK).json({message, assignments})
      }
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    })
}

function getAssigmentsByUser(req, res, next) {
  let message
  models.assignmentsModel.findAll({
    include: [{
      model: models.groupsModel,
      as: 'group',
      required: true,
      include: [{
        model: models.usersrolatrModel,
        as: 'usersrolatr',
        where: {usr_id: req.params.id}
      }]
    }, {
      model: models.userModel,
      as: 'user'
    }],
    order: [['asm_finaldate', 'ASC']]

  }).then((assignments) => {
    if (assignments.length > 0) {
      message = properties.get('message.res.okData')
      res.status(HttpStatus.OK).json({message, assignments})
    } else {
      message = properties.get('message.asm.res.notData')
      res.status(HttpStatus.OK).json({message, assignments})
    }
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })
}

async function getNotesByGroup(req, res) {
  try {
    let message;
    let id = req.params.id;
    let assingments = await models.assignmentsModel.findAll({where: {grp_id: id, asm_status: 2}}).catch(err => {
      throw err;
    });
    let agreements = await models.agreementModel.findAll({where: {grp_id: id, agr_status: 1}}).catch(err => {
      throw err;
    });
    let notes = {
      assingments,
      agreements
    }

    message = properties.get('message.res.okData');
    res.status(HttpStatus.OK).json({message, notes})
  } catch (e) {
    message = properties.get('message.res.errorInternalServer');
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
  }
}

async function getAssiByMeeting(req, res, next) {
  let message
  let id = req.params.id
  console.log(id)

  models.assignmentsModel.findAll({
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

    .then((assignments) => {
      if (assignments.length > 0) {
        message = properties.get('message.res.okData')
        res.status(HttpStatus.OK).json({message, assignments})
      } else {
        message = properties.get('message.asm.res.notData')
        res.status(HttpStatus.OK).json({message, assignments})
      }

    }, (err) => next(err))
    .catch((err) => next(err))
}


module.exports = {
  addAssignment,
  getAllByGroup,
  getAllByParticipants,
  getAllByStatus,
  getAllByUser,
  getAllByUserGroup,
  getNextStatus,
  updateAssignment,
  updateStatusAssignment,
  notImplementedOperation,
  getAssiByGroup,
  getAssigmentsByRol,
  getAssigmentsByUser,
  getNotesByGroup,
  getAssiByMeeting
}
