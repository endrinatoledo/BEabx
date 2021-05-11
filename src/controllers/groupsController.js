const HttpStatus = require('http-status-codes')
const PropertiesReader = require('properties-reader')
const sequelize = require('sequelize')

const models = require('../models')
const {Op} = require("sequelize");
const properties = PropertiesReader('./src/bin/common.properties')

function getAll(req, res, next) {
  let message

  models.groupsModel.findAll({
    include: [{
      model: models.organizationsModel,
      as: 'organizations'
    }]
  }).then((groups) => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, groups})
  }).catch((err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })
}

function getGroupById(req, res, next) {
  let message

  models.groupsModel.findOne({
    where: {
      id: req.params.id
    }
  }).then((groups) => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, groups})
  }).catch((err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })
}

function addParticipant(req, res, next) {
  if (!req.body.userid || !req.body.groupid || !req.body.rolid || !req.body.urgstatus) return res.status(406).json({ok: false, message: 'Los campos son obligatorios'})
  models.usersrolatrModel.create({
    usrId: req.body.userid,
    grpId: req.body.groupid,
    rolId: req.body.rolid,
    urgStatus: req.body.urgstatus

  }).then((comments) => {
      res.status(HttpStatus.OK).json(comments)
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    }
  )
}

function getGroupByOrg(req, res, next) {
  let message

  const query1 =
    models.groupsModel.findAll({
      include: [{
        model: models.organizationsModel,
        as: 'organizations',
        require: true,
        where: {orgId: req.params.id}
      }]
    }).then((groups) => {
      message = properties.get('message.res.okData')
      res.status(HttpStatus.OK).json({message, groups})
    }).catch((err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

      next(err)
    })
}


function getAllByUser(req, res, next) {
  let message

  models.groupsModel.findAll({
    include: [{
      model: models.organizationsModel,
      as: 'organizations'
    }, {
      model: models.usersrolatrModel,
      as: 'usersrolatr',
      where: {usr_id: req.params.id},
      required: true,
      attributes: ['rol_id']
    }]
  }).then((groups) => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, groups})
  }).catch((err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })
}

function addGroups(req, res, next) {
  let message
  if (!req.body.name || !req.body.acronym || !req.body.orgId || !req.body.description) return res.status(406).json({ok: false, message: 'Los campos son obligatorios'});
  models.groupsModel.create({
    name: req.body.name,
    parentId: req.body.parentId,
    description: req.body.description,
    acronym: req.body.acronym,
    orgId: req.body.orgId,
    img: req.body.img
  }).then((groups) => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, groups})
  }, (err) => {

    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })
}

function updateGroups(req, res, next) {
  let message
  models.groupsModel.findOne({
    where: {
      id: req.body.id
    }
  })
    .then((groups) => {
      if (groups) {
        groups.update({
          name: (req.body.name != null) ? req.body.name : groups.name,
          parentId: (req.body.parentId != null) ? req.body.parentId : groups.parentId,
          description: (req.body.description != null) ? req.body.description : groups.description,
          acronym: (req.body.acronym != null) ? req.body.acronym : groups.acronym,
          orgId: (req.body.orgId != null) ? req.body.orgId : groups.orgId
        }).then((groups) => {
          message = properties.get('message.res.okData')
          res.status(HttpStatus.OK).json({message, groups})
        }, (err) => {
          message = properties.get('message.res.errorInternalServer')
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

          next(err)
        })
      } else {
        const err = new Error('No se encontra el grupo')
        err.status = HttpStatus.NOT_FOUND

        return next(err)
      }
    }, (err) => next(err))
    .catch((err) => next(err))
}

// function deletePartGroup(req, res, next) {
//   models.usersrolatrModel.destroy({
//       where: {
//         usrId: req.params.idPart,
//         grpId: req.params.idGroup
//       }
//     }
//   ).then((rowsDeleted) => {
//     if (rowsDeleted > 0) {
//       const message = "Participante eliminado exitosamente"
//       res.status(HttpStatus.OK).json({message})
//     } else {
//       const err = new Error('No se pudo eliminar el participante ')
//       err.status = HttpStatus.NOT_FOUND
//       return next(err)
//     }
//   }, (err) => next(err))
//     .catch((err) => next(err))
// }
const deletePartGroup = async (req, res) => {
  try {
    let {idPart, idGroup} = req.params;
    if ((typeof idPart === "undefined" || idPart === null) || (typeof idGroup === "undefined" || idGroup === null)) return res.status(400).json({ok: false, message: 'los campos son requeridos'});
    let participant = await models.usersrolatrModel.findOne({where: {usrId: idPart, grpId: idGroup}}).catch(err => {
      throw err
    });
    if (participant === null) return res.status(404).json({ok: false, message: 'usuario no existe'});
    await participant.destroy();
    return res.status(200).json({ok: true, message: 'Participante Eliminado'});
  } catch (err) {
    return res.status(500).json({ok: false, message: err.message})
  }
}


function deleteGroup(req, res, next) {
  models.usersrolatrModel.destroy({
    where: {
      grpId: req.params.idGroup
    }
  }).then((rowsDeleted) => {
    if (rowsDeleted > 0) {
      models.assignmentsModel.findOne({
        where: {
          grpId: req.params.idGroup
        }
      }).then(assignments => {
        if (assignments) {
          models.commentsModel.destroy({
            where: {
              asmId: assignments.id
            }
          }).then(Comment => {
            models.assignmentsModel.destroy({
              where: {
                grpId: req.params.idGroup
              }
            }).then(assignments => {
              models.agreementModel.destroy({
                where: {
                  grpId: req.params.idGroup
                }
              }).then(agreement => {
                models.invitationsModel.destroy({
                  where: {
                    grpId: req.params.idGroup
                  }
                }).then(Invitation => {
                  models.groupsModel.destroy({
                    where: {
                      id: req.params.idGroup
                    }
                  }).then(groups => {
                    let message = "Grupo eliminado exitosamente";
                    res.status(HttpStatus.OK).json({message})
                  })
                })
              })
            })
          })
        } else {
          models.agreementModel.destroy({
            where: {
              grpId: req.params.idGroup
            }
          }).then(agreement => {
            models.invitationsModel.destroy({
              where: {
                grpId: req.params.idGroup
              }
            }).then(Invitation => {
              models.groupsModel.destroy({
                where: {
                  id: req.params.idGroup
                }
              }).then(groups => {

                let message = "Grupo eliminado exitosamente";
                res.status(HttpStatus.OK).json({message})
              })
            })
          })
        }
      })
    } else {
      const err = new Error('No se pudo eliminar el grupo')
      err.status = HttpStatus.NOT_FOUND
      return next(err)
    }
  }, (err) => next(err))
    .catch((err) => next(err))
}

function deleteGroups(req, res, next) {
  models.groupsModel.destroy({
    where: {
      id: req.params.idGroup
    }
  }).then((rowsDeleted) => {

    if (rowsDeleted > 0) {
      res.status(HttpStatus.OK).json('Grupo eliminado exitosamente')
    } else {
      const err = new Error('No se pudo eliminar el grupo')
      err.status = HttpStatus.NOT_FOUND

      return next(err)
    }
  }, (err) => next(err))
    .catch((err) => next(err))
}

function addGroupByUser(req, res, next) {
  let message
  models.groupsModel.create({
    name: req.body.name,
    parentId: req.body.parentId,
    description: req.body.description,
    acronym: req.body.acronym,
    orgId: req.body.orgId,
    img: req.body.img
  }).then((groups) => {
    models.usersrolatrModel.create({
      usrId: req.body.userId,
      grpId: groups.id,
      rolId: '1,2',
      urgStatus: 1

    })
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, groups})
  }, (err) => {

    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })
}

function getLeaderByGroup(req, res, next) {
  let message
  const idGroup = req.params.idGroup
  const rol = '1,2'
  models.userModel.findOne({
    include: [{
      model: models.usersrolatrModel,
      as: 'usersrolatr',
      where: {rolId: rol, grpId: idGroup},
      include: [{
        model: models.groupsModel,
        as: 'groups'
      }]
    }]
  }).then((user) => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, user})
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })

}

async function getGroupByUserOrg(req, res) {
  try {
    let message;
    let id = req.params.id;
    let organizationId = await models.employeeModel.findOne({where: {usr_id: id}}).catch(err => {
      throw err;
    });
    let groups = await models.groupsModel.findAll({
      where: {orgId: organizationId.orgId},
      include: [{
        where: {usrId: id},
        model: models.usersrolatrModel,
        as: 'usersrolatr',
        attributes: ['urg_status', 'rol_id']
      }],
      raw: true
    });
    let usersByGroup = await models.groupsModel.findAll({
      where: {orgId: organizationId.orgId},
      group: ['groupsModel.grp_id'],
      attributes: {include: [[sequelize.fn('COUNT', sequelize.col('usersrolatr.usr_id')), 'participantes']]},
      include: [{
        model: models.usersrolatrModel,
        as: 'usersrolatr',
        attributes: []
      }],
      raw: true
    });
    // console.log(usersByGroup)
    let leaderByGroup = await models.groupsModel.findAll({
      attributes: ['id'],
      where: {orgId: organizationId.orgId},
      include: [{
        model: models.usersrolatrModel,
        as: 'usersrolatr',
        where: {rolId: {[sequelize.Op.like]: '%1%'}},
        attributes: ['rolId'],
        include: [{
          model: models.userModel,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email']
        }]
      }],
      raw: true
    }).catch(err => {
      throw err;
    });
    let information = [];

    function removeItemFromArr(arr, item) {
      let i = arr.indexOf(item);

      if (i !== -1) {
        arr.splice(i, 1);
      }
    }

    [...usersByGroup].map((orgGroup, index) => {
      information.push(orgGroup);
      [...groups].map((userGroup, index) => {
        if (userGroup.id === orgGroup.id) {
          orgGroup.user = {
            rolId: userGroup[`usersrolatr.rol_id`],
            status: userGroup[`usersrolatr.urg_status`]
          };
        }
      });
      // if (!orgGroup.status) orgGroup.status = 1;
      [...leaderByGroup].map((liderGroup, index) => {
        if (liderGroup.id === orgGroup.id) {
          orgGroup[`lider`] = liderGroup;
          orgGroup[`lider`][`status`] = 1;
        }
      })
      if (!orgGroup[`lider`]) information.find(element => {
        if (element === orgGroup) removeItemFromArr(information, element);
      });
    });
// let exclude = usersByGroup.filter((group) => {
//   let ok = true;
//   groups.forEach(function (grupo, i) {
//     if (grupo.id === group.id) {
//       ok = false;
//     }
//   })
//   return ok
// })
// let newArray = [];
// exclude.forEach(function (grupo, i) {
//   newArray.push({grupo, lider: {}});
//   leaderByGroup.forEach(function (usuario, j) {
//     console.log(usuario)
//     if (usuario.id === grupo.id) {
//       newArray[i].lider = (usuario);
//     }
//   })
// })
    message = properties.get('message.res.okData');
    res.status(HttpStatus.OK).json({message, groups: information})
  } catch
    (e) {
    console.log(e)
    message = properties.get('message.res.errorInternalServer');
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
  }
}

function getGroupParticipants(req, res, next) {

  const USERACT = properties.get('const.usr.userAct')

  models.usersrolatrModel.findAll({
    where: {
      grpId: req.params.id,
      urgStatus: USERACT
    }, include: [{
      model: models.userModel,
      as: 'user'
    }]
  })
    .then((users) => {
      message = properties.get('message.res.okData');
      res.status(HttpStatus.OK).json({message, users})
    })
    .catch((err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    })
}

const membershipGroup = async (req, res) => {
  try {
    let {rol_id, urg_status, usr_id, grp_id} = req.body;
    await models.usersrolatrModel.create({
      rolId: rol_id,
      urgStatus: urg_status,
      usrId: usr_id,
      grpId: grp_id
    }).catch(err => {
      throw err
    })
    return res.status(200).json({ok: true, message: 'Membership ok'})
  } catch (err) {
    return res.status(500).json({ok: false, message: err.message})
  }
}

const activateMembershipGroup = async (req, res) => {
  try {
    let {id, grpId} = req.params;
    if (!id || !grpId) return res.status(400).json({ok: false, message: 'El Id del usuario es requerido'});
    await models.usersrolatrModel.update({urgStatus: 1}, {where: {usrId: id, rolId: 2, grpId: grpId}}).catch(err => {
      throw err
    }).catch(err => {
      throw err
    })
    return res.status(200).json({ok: true, message: 'El usuario ha sido aceptado al grupo'});
  } catch (err) {
    return res.status(500).json({ok: false, message: err.message})
  }
}

async function getStatisticsByGroup(req, res) {
  try {
    let message;
    let id = req.params.id;
    /*        let assignsByStatus = await models.assignmentsModel.findAll({
                where: {grp_id: id},
                attributes: [
                    'asm_status',
                    [sequelize.fn('COUNT', sequelize.col('asm_status')), 'count'],
                ],
                group: 'asm_status',
                raw: true
            })*/
    let pendingAssigns = await models.assignmentsModel.count({
      where: {grp_id: id, asm_status: 1}
    })
    let activeAssigns = await models.assignmentsModel.count({
      where: {grp_id: id, asm_status: 2}
    })
    let closeAssigns = await models.assignmentsModel.count({
      where: {grp_id: id, asm_status: 3}
    })
    let precloseAssigns = await models.assignmentsModel.count({
      where: {grp_id: id, asm_status: 4}
    })
    let totalAssigns = await models.assignmentsModel.count({
      where: {grp_id: id}
    })
    let totalAgreements = await models.agreementModel.count({
      where: {grp_id: id}
    })
    let totalMeetings = await models.meetingModel.count({
      where: {grp_id: id}
    })
    let totalInfo = await models.notesModel.count({
      where: {grp_id: id}
    })
    let statistics = {
      activeAssigns,
      pendingAssigns,
      closeAssigns,
      precloseAssigns,
      totalAssigns,
      totalAgreements,
      totalMeetings,
      totalInfo
    }
    return res.status(200).send({message: 'Completed Successfully', statistics})
  } catch (e) {
    console.log('Query Result', e)
  }
}

module.exports = {

  addGroups,
  deleteGroups,
  getAll,
  getAllByUser,
  updateGroups,
  getGroupByOrg,
  addParticipant,
  addGroupByUser,
  deleteGroup,
  deletePartGroup,
  getLeaderByGroup,
  getGroupById,
  getGroupByUserOrg,
  getGroupParticipants,
  membershipGroup,
  activateMembershipGroup,
  getStatisticsByGroup

}
