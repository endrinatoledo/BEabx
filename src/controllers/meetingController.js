const HttpStatus = require('http-status-codes')
const PropertiesReader = require('properties-reader')
let models = require('../models')
var Sequelize = require('sequelize');
var sequelize = new Sequelize('abx', 'root', '', {"dialect": "mysql"});
const properties = PropertiesReader(`./src/bin/common.properties`)

function getAllMeeting(req, res, next) {
  models.meetingModel.findAll({
    include: [{
      model: models.groupsModel,
      as: 'groups'
    }]
  }).then(meeting => {
      message = properties.get('message.res.okData')
      res.status(HttpStatus.OK).json({message, meeting})
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    }
  )
}

function getMeetingsByGroup(req, res, next) {
  models.meetingModel.findAll({
    where: {status: 2},
    include: [{
      model: models.groupsModel,
      as: 'groups',
      where: {id: req.params.id},
      attributes: []
    }]
  }).then(meeting => {
      message = properties.get('message.res.okData')
      res.status(HttpStatus.OK).json({message, meeting})
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    }
  )
}

function getMeeting(req, res, next) {

  models.meetingModel.findOne({
    where: {
      id: req.params.id
    }
  }).then(meeting => {

      message = properties.get('message.res.okData')
      res.status(HttpStatus.OK).json({message, meeting})
    }, (err) => {

      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    }
  )
}

function getPaticipantByMeeting(req, res, next) {
  models.participantsModel.findAll({
    where: {
      meeId: req.params.id
    },
  }).then(participants => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, participants})
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
    next(err)
  })

}

async function addMeeting(req,res) {
  try{

    let obj = [];
    let newParts = [];
    let message = '';
    const STATUSUSERGROUPPENDING = properties.get('const.grp.statusUserGroupPending')
    const ROLPART = properties.get('const.usr.rolPart')
    const DEFAULTPASSWORD = properties.get('const.usr.defaultPassword')
    const POSINVITED = properties.get('const.pos.posInvited')
    const USERPENDING = properties.get('const.usr.userPending')
    let parts = req.body.participants.forEach(function (part) {
      obj.push(part)
    });

    let newMeeting = await models.meetingModel.create({
      title: req.body.title,
      date: req.body.date,
      grpId:req.body.grpId,
      oriId:req.body.oriId,
      usrId: req.body.usrId,
      status: req.body.status,
    }).catch(err => {
      throw err});
    models.sequelize.transaction(function (t) {
      let Promises= [];

      models.groupsModel.findOne({where: { id:req.body.grpId} })
      .then(group=>{

        for (let i=0;i<obj.length;i++){
          if(obj[i].email){

            let newPromise= models.participantsModel.create({
              userEmail: obj[i].email,
              userId: obj[i].id,
              meeId: newMeeting.id
            });
            Promises.push(newPromise);
          }else{

            let newPromise= models.participantsModel.create({
              userEmail: obj[i],

              meeId: newMeeting.id
            });

            Promises.push(newPromise);
          }

        }

        return Promise.all(Promises).then(function (result) {
          newParts = result;
          message = properties.get('message.res.okData');
          return res.status(HttpStatus.OK).json({ message, meeting: newMeeting, part: newParts})
        }).catch(function (err) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err })
        })

      },(err)=>{
        message = properties.get('message.res.errorInternalServer')
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message })
        next(err)
      }
      )
    })
 }catch (e) {
    console.log(e)
    message = properties.get('message.res.errorInternalServer');
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message })
  }
}


function updateMeeting(req, res, next) {
  let message
  models.meetingModel.findOne({
    where: {
      id: req.params.id
    }
  })
    .then((meeting) => {
      if (meeting) {
        meeting.update({
          title: (req.body.title != null) ? req.body.title : meeting.title,
          date: (req.body.date != null) ? req.body.date : meeting.date,
          grpId: (req.body.grpId != null) ? req.body.grpId : meeting.grpId,
          oriId: (req.body.oriId != null) ? req.body.oriId : meeting.oriId,
          status: (req.body.status != null) ? req.body.status : meeting.status
        }).then((meeting) => {
          message = properties.get('message.res.okData')
          res.status(HttpStatus.OK).json({message, meeting})
        }, (err) => {
          message = properties.get('message.res.errorInternalServer')
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
          next(err)
        })
      } else {
        const err = new Error('No se encontra el meeting')
        err.status = HttpStatus.NOT_FOUND
        return next(err)
      }
    }, (err) => next(err))
    .catch((err) => next(err))
}

function deleteMeeting(req, res, next) {
  models.meetingModel.destroy({
      where: {
        id: req.params.id
      }
    }
  ).then((rowsDeleted) => {
    if (rowsDeleted > 0) {
      const message = properties.get('message.res.deleteData')
      res.status(HttpStatus.OK).json({message})
    } else {
      const message = properties.get('message.res.erroDeleteData')
      const err = new Error(message)
      err.status = HttpStatus.NOT_FOUND
      return next(err)
    }
  }, (err) => next(err))
    .catch((err) => next(err))
}

async function updateMeetingPrecloser(req, res, next) {
  try {
    let id = req.params.id
    let meeting = await models.meetingModel.findByPk(id)
    if (meeting === null) return res.status(200).json({ok: false, message: 'No se encontra el meeting'});
    if (Number(meeting.status) === 2) return res.status(406).json({ok: false, message: 'El meeting ya tiene el estatus de pre-cerrado'});
    await meeting.update({status: 2});
    return res.status(200).json({ok: true, message: 'Reunion pre-cerrada'});
  } catch (err) {
    return res.status(500).json({ok: false, message: err.message});
  }
  // let message
  // let exeSta = properties.get('const.mee.executionStatus')
  // let preSta = properties.get('const.mee.precloserStatus')
  // let camp = new Object()
  // camp.status = preSta
  // getMeetingById(id)
  //   .then(meet => {
  //       if (Number(meet.status) === Number(exeSta)) {
  //         putMeetingById(meet, camp).then((meet) => {
  //           message = properties.get('message.res.okData')
  //           res.status(HttpStatus.OK).json({message, meet})
  //         }, (err) => {
  //           message = properties.get('message.res.errorInternalServer')
  //           res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
  //           next(err)
  //         })
  //       } else {
  //         const err = new Error('No se encontra el meeting')
  //         err.status = HttpStatus.NOT_FOUND
  //         return next(err)
  //       }
  //     }, (err) => {
  //
  //       message = properties.get('message.res.errorInternalServer')
  //       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
  //       next(err)
  //     }
  //   )

}

function putMeetingById(meet, camp) {
  return meet.update({
    title: (camp.title != null) ? camp.title : meet.title,
    date: (camp.date != null) ? camp.date : meet.date,
    grpId: (camp.grpId != null) ? camp.grpId : meet.grpId,
    oriId: (camp.oriId != null) ? camp.oriId : meet.oriId,
    status: (camp.status != null) ? camp.status : meet.status
  })
}

function getMeetingById(id) {
  return models.meetingModel.findOne({
    where: {
      id
    }
  })
}


function getUsersByMeeting(req, res, next) {
  models.userModel.findAll({
    include: [{
      model: models.participantsModel,
      as: 'participant',
      where: {
        meeId: req.params.id
      },
      attributes: []
    }],
  }).then(users => {
      message = properties.get('message.res.okData')
      res.status(HttpStatus.OK).json({message, users})
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    }
  )
}

const getOrderedMeetingById = async (req, res) => {
  try {
    let {grpId, meeId, rolId} = req.params;
    let meetingData = [];
    if (rolId !== '1,2') return res.status(401).json({ok: false, message: 'No posees los permisos para realizar esta Accion'});
    let group = await models.groupsModel.findOne({where: {id: grpId}}).catch(err => {
      throw err
    });
    if (group === null) return res.status(404).json({ok: false, message: 'nonexistent Group'});
    let meeting = await models.meetingModel.findOne({where: {grpId: group.id, id: meeId}}).catch(err => {
      throw err
    });
    if (meeting === null) return res.status(404).json({ok: false, message: 'nonexistent meeting'});
    let agreement = await models.agreementModel.findAll({where: {grpId: grpId, meeId: meeId}}).catch(err => {
      throw err
    });

    let assignments = await models.assignmentsModel.findAll({where: {grpId: grpId, meeId: meeId}}).catch(err => {
      throw err
    });

    let notes = await models.notesModel.findAll({where: {grpId: grpId, meeId: meeId}}).catch(err => {
      throw err
    });
    meetingData.push({agreement: agreement, assignments: assignments, notes: notes});
    // meetingData.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
    return res.status(200).json(meetingData)
  } catch (err) {
    return res.status(500).json({ok: false, message: err.message});
  }
}
const orderedMeetingById = async (req, res) => {
  try {
    console.log(req.body)
    let {grpId, meeId, ordered, usrId} = req.body;
    let agreementArr = [], assignmentArr = [], notesArr = [];
    if ((grpId === "undefined" || grpId === null || grpId === '') || (meeId === "undefined" || meeId === null || meeId === '')) return res.status(400).json({ok: false, message: 'Los Campos son Requeridos'});
    if (ordered.length === 0) return res.status(406).json({ok: false, message: 'ordered is required'});
    let group = await models.groupsModel.findOne({where: {id: grpId}}).catch(err => {
      throw err
    });
    if (group === null) return res.status(404).json({ok: false, message: 'nonexistent Group'});
    let verifiedUserRol = await models.usersrolatrModel.findOne({where: {grpId: grpId, usrId: usrId}});
    if (verifiedUserRol.rolId !== '1,2') return res.status(401).json({ok: false, message: 'No posees los permisos para realizar esta Accion'});
    let meeting = await models.meetingModel.findAll({where: {grpId: group.id, id: meeId}}).catch(err => {
      throw err
    });
    if (meeting === null) return res.status(404).json({ok: false, message: 'nonexistent meeting'});
    if (ordered.filter(notAceptable => notAceptable.position === '' || notAceptable.position === null || !notAceptable.position).length > 0) return res.status(406).json({ok: false, message: 'the position is required'})
    ordered.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
    ordered.map(handle => {
      if (handle.handler === "agreement") agreementArr.push(handle)
      if (handle.handler === "assignments") assignmentArr.push(handle)
      if (handle.handler === "notes") notesArr.push(handle)
    });
    if (assignmentArr.length > 0) {
      let agr = agreementArr.map(async handle => {
        let value = await models.agreementModel.findOne({where: {id: handle.id, meeId: meeId}}).catch(err => {
          throw err
        })
        if (value === null) throw new Error('no exist agreement')
        await value.update({agrPosition: handle.position}, {where: {id: handle.id, meeId: meeId}}).catch(err => {
          throw err
        })
      })
    }
    if (assignmentArr.length > 0) {
      let asm = assignmentArr.map(async handle => {
        let value = await models.assignmentsModel.findOne({where: {id: handle.id, meeId: meeId}}).catch(err => {
          throw err
        })
        if (value === null) throw new Error('no exist agreement')
        await value.update({asmPosition: handle.position}, {where: {id: handle.id, meeId: meeId}}).catch(err => {
          throw err
        })
      })
    }
    if (notesArr.length > 0) {
      let noe = notesArr.map(async handle => {
        let value = await models.notesModel.findOne({where: {id: handle.id, meeId: meeId}}).catch(err => {
          throw err
        })
        if (value === null) throw new Error('no exist agreement')
        await value.update({noePosition: handle.position}, {where: {id: handle.id, meeId: meeId}}).catch(err => {
          throw err
        })
      })
    }
    return res.status(200).json({ok: true, message: ''});
  } catch (err) {
    return res.status(500).json({ok: false, message: err.message});
  }
}
const getOrderedMeetingByEntity = async (req, res) => {
  try {
    let {grpId, meeId, usrId, entity} = req.params;
    console.log(req.params)
    // if (entity !== 'agreements' || entity !== 'assignments' || entity !== 'notes') return res.status(406).json({ok: false, message: 'entity not accepted'});
    let group = await models.groupsModel.findOne({where: {id: grpId}}).catch(err => {
      throw err
    });
    if (group === null) return res.status(404).json({ok: false, message: 'nonexistent Group'});
    let verifiedUserRol = await models.usersrolatrModel.findOne({where: {grpId: grpId, usrId: usrId}});
    if (verifiedUserRol.rolId !== '1,2') return res.status(401).json({ok: false, message: 'No posees los permisos para realizar esta Accion'});
    let meeting = await models.meetingModel.findAll({where: {grpId: group.id, id: meeId}}).catch(err => {
      throw err
    });
    if (meeting === null) return res.status(404).json({ok: false, message: 'nonexistent meeting'});
    switch (entity) {
      case 'agreements': {
        let agreements = await models.agreementModel.findAll({where: {grpId: group.id, meeId: meeId}}).catch(err => {
          throw err
        })
        agreements.sort((a, b) => (a.agrPosition > b.agrPosition) ? 1 : ((b.agrPosition > a.agrPosition) ? -1 : 0));
        return res.status(200).json({ok: true, agreements})
      }
      case 'assignments': {
        let assignments = await models.assignmentsModel.findAll({where: {grpId: group.id, meeId: meeId}}).catch(err => {
          throw err
        })
        assignments.sort((a, b) => (a.asmPosition > b.asmPosition) ? 1 : ((b.asmPosition > a.asmPosition) ? -1 : 0));
        return res.status(200).json({ok: true, assignments})
      }
      case 'notes': {
        let notes = await models.notesModel.findAll({where: {grpId: group.id, meeId: meeId}}).catch(err => {
          throw err
        })
        notes.sort((a, b) => (a.noePosition > b.noePosition) ? 1 : ((b.noePosition > a.noePosition) ? -1 : 0));
        return res.status(200).json({ok: true, notes})
      }
      default:
        return res.status(405).json({ok: false, message: "Entity not found"})
    }
  } catch (err) {
    return res.status(500).json({ok: false, message: err.message});
  }
}
const orderedEntityMeetingById = async (req, res) => {
  try {
    let {grpId, meeId, usrId, ordered, handler} = req.body;
    let agreementArr = [], assignmentArr = [], notesArr = [];
    if (ordered.length === 0) return res.status(406).json({ok: false, message: 'ordered is required'});
    let group = await models.groupsModel.findOne({where: {id: grpId}}).catch(err => {
      throw err
    });
    if (group === null) return res.status(404).json({ok: false, message: 'nonexistent Group'});
    let verifiedUserRol = await models.usersrolatrModel.findOne({where: {grpId: grpId, usrId: usrId}});
    if (verifiedUserRol.rolId !== '1,2') return res.status(401).json({ok: false, message: 'No posees los permisos para realizar esta Accion'});
    let meeting = await models.meetingModel.findAll({where: {grpId: group.id, id: meeId}}).catch(err => {
      throw err
    });
    if (meeting === null) return res.status(404).json({ok: false, message: 'nonexistent meeting'});
    switch (handler) {
      case 'agreements' : {
        if (!ordered[`agreements`]) return res.status(400).json({ok: false, message: 'agreements cannot be empty'});
        if (ordered[`agreements`].length === 0) return res.status(400).json({ok: false, message: 'ordered cannot be empty'});
        ordered[`agreements`].sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
        for await (const handle of ordered[`agreements`]) {
          let value = await models.agreementModel.findOne({where: {id: handle.id, meeId: meeId}}).catch(err => {
            console.log(err)
            throw err
          })
          if (value === null) return res.status(404).json({ok: false, message: `data of agreements does not exist in the db `})
          agreementArr.push(handle);
        }
        agreementArr.map(async handle => {
          let value = await models.agreementModel.findOne({where: {id: handle.id, meeId: meeId}}).catch(err => {
            throw err
          })
          // if (value === null) throw new Error('no exist agreement') // solo si es necesario de usarlo, pudiera dar problemas, por eso los id se verifican antes de realizar su actualizacion
          await value.update({agrPosition: handle.position}, {where: {id: handle.id, meeId: meeId}}).catch(err => {
            throw err
          })
        })
        return res.status(200).json({ok: true, message: 'updated position order in agreement'});
      }
      case 'assignments': {
        if (!ordered[`assignments`]) return res.status(400).json({ok: false, message: 'assignments cannot be empty'});
        if (ordered[`assignments`].length === 0) return res.status(400).json({ok: false, message: 'ordered cannot be empty'});
        ordered[`assignments`].sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
        for await (const handle of ordered[`assignments`]) {
          let value = await models.assignmentsModel.findOne({where: {id: handle.id, meeId: meeId}}).catch(err => {
            throw err
          })
          if (value === null) return res.status(404).json({ok: false, message: `data of assignments does not exist in the db `})
          assignmentArr.push(handle);
        }
        assignmentArr.map(async handle => {
          let value = await models.assignmentsModel.findOne({where: {id: handle.id, meeId: meeId}}).catch(err => {
            throw err
          })
          // if (value === null) throw new Error('no exist agreement') // solo si es necesario de usarlo, pudiera dar problemas, por eso los id se verifican antes de realizar su actualizacion
          await value.update({asmPosition: handle.position}, {where: {id: handle.id, meeId: meeId}}).catch(err => {
            throw err
          })
        })
        return res.status(200).json({ok: true, message: 'updated position order in assignments'});
      }
      case 'notes': {
        if (!ordered[`notes`]) return res.status(400).json({ok: false, message: 'notes cannot be empty'});
        if (ordered[`notes`].length === 0) return res.status(400).json({ok: false, message: 'ordered cannot be empty'});
        ordered[`notes`].sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
        for await (const handle of ordered[`notes`]) {
          let value = await models.notesModel.findOne({where: {id: handle.id, meeId: meeId}}).catch(err => {
            throw err
          })
          if (value === null) return res.status(404).json({ok: false, message: `data of notes does not exist in the db `})
          notesArr.push(handle);
        }
        notesArr.map(async handle => {
          let value = await models.notesModel.findOne({where: {id: handle.id, meeId: meeId}}).catch(err => {
            throw err
          })
          // if (value === null) throw new Error('no exist agreement') // solo si es necesario de usarlo, pudiera dar problemas, por eso los id se verifican antes de realizar su actualizacion
          await value.update({noePosition: handle.position}, {where: {id: handle.id, meeId: meeId}}).catch(err => {
            throw err
          })
        })
        return res.status(200).json({ok: true, message: 'updated position order in notes'});
      }
      default:
        return res.status(400).json({ok: false, message: 'there is no entity'});
    }
  } catch (err) {
    return res.status(500).json({ok: false, message: err.message});
  }
}

/** asociate position in 3 entities**/

const getOrderPositionByMeeting = async (req, res) => {
  try {
    let {meeId, usrId, grpId} = req.params;
    let positions = [];
    let ordered = []
    let verifiedUserRol = await models.usersrolatrModel.findOne({where: {grpId: grpId, usrId: usrId}});
    if (verifiedUserRol.rolId !== '1,2') return res.status(401).json({ok: false, message: 'No posees los permisos para realizar esta Accion'});
    positions = await models.meetingPositionsModel.findAll({
      where: {meeId}
    }).catch(err => {
      throw err
    })
    await Promise.all(positions.map(async pos => {
      if (pos.agrId !== null) {
        let agr = await models.agreementModel.findOne({where: {id: pos.agrId}, include: {model: models.userModel, as: 'user'}})
        agr.dataValues.handler = 'Acuerdos'
        agr.dataValues.position = pos.position
        ordered.push(agr.dataValues)
      }
      if (pos.asmId !== null) {
        let asm = await models.assignmentsModel.findOne({where: {id: pos.asmId}, include: {model: models.userModel, as: 'user'}})
        asm.dataValues.handler = 'Asignaciones'
        asm.dataValues.position = pos.position
        ordered.push(asm.dataValues)
      }
      if (pos.noeId !== null) {
        let noe = await models.notesModel.findOne({where: {id: pos.noeId}, include: {model: models.userModel, as: 'user'}})
        noe.dataValues.handler = 'Informacion'
        noe.dataValues.position = pos.position
        ordered.push(noe.dataValues)
      }
    }))
    await ordered.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
    return res.status(200).json({ok: true, ordered})
  } catch (err) {
    return res.status(500).json({ok: false, message: err.message});
  }
}

const updateOrderPositionByMeeting = async (req, res) => {
  try {
    let {meeId, older_pos, new_pos} = req.body;
    if (older_pos > new_pos) {
      let pos = await models.meetingPositionsModel.findOne({where: {position: older_pos}}).catch(err => {
        throw err
      })
      await sequelize.query(`UPDATE meeting_positions SET position = ${new_pos} where position = ${older_pos} and meeId = ${meeId}`).catch(err => {
        throw err
      })
      await sequelize.query(`UPDATE meeting_positions SET position = (position + 1) WHERE position between ${new_pos} and ${older_pos} and meeId = ${meeId} and not id = ${pos.id}`).catch(err => {
        throw err
      })
      return res.status(200).json({ok: true, message: 'updated position'})
    }
    if (older_pos < new_pos) {
      let pos = await models.meetingPositionsModel.findOne({where: {position: older_pos}}).catch(err => {
        throw err
      })
      await sequelize.query(`UPDATE meeting_positions SET position = ${new_pos} where position = ${older_pos} and meeId = ${meeId}`).catch(err => {
        throw err
      })
      await sequelize.query(`UPDATE meeting_positions SET position = (position - 1) WHERE position between ${older_pos} and ${new_pos} and meeId = ${meeId} and not id = ${pos.id}`).catch(err => {
        throw err
      })
    }
    return res.status(200).json({ok: true, message: 'updated position'});
  } catch (err) {
    return res.status(500).json({ok: false, message: err.message});
  }
}


async function updateMeetingCloser(req, res) {
  try {
    let {idMee, userId} = req.params;
    let {status} = req.body;
    let meeting = await models.meetingModel.findByPk(idMee)
    if (meeting === null) return res.status(200).json({ok: false, message: 'No se encontra el meeting'});
    if (Number(meeting.status) === 3) return res.status(406).json({ok: false, message: 'El meeting ya tiene el estatus de pre-cerrado'});
    await meeting.update({status});
    return res.status(200).json({ok: true, message: 'Reunion Cerrada'});
  } catch (err) {
    return res.status(500).json({ok: false, message: err.message});
  }
  // let message
  // let cloSta = properties.get('const.mee.closerStatus')
  // let preSta = properties.get('const.mee.precloserStatus')
  // let camp = new Object()
  // camp.status = cloSta
  // let idMee = req.params.idMee
  // let idUser = req.params.userId
  //
  // getMeetingById(idMee)
  //   .then(meet => {
  //
  //     if (meet) {
  //       if (meet.status == preSta) {
  //         if (meet.usrId == idUser) {
  //           //actualizacion de estado
  //           putMeetingById(meet, camp).then((meet) => {
  //             message = properties.get('message.mee.res.okStatus')
  //             res.status(HttpStatus.OK).json({message, meet})
  //           }, (err) => {
  //             message = properties.get('message.res.errorInternalServer')
  //             res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
  //             next(err)
  //           })
  //         } else {
  //           message = properties.get('message.mee.res.notRolCloser')
  //           const err = new Error(message)
  //           err.status = HttpStatus.NOT_FOUND
  //           return next(err)
  //         }
  //       } else {
  //         message = properties.get('message.mee.res.notStatus')
  //         const err = new Error(message)
  //         err.status = HttpStatus.NOT_FOUND
  //         return next(err)
  //       }
  //     } else {
  //       message = properties.get('message.mee.res.notData')
  //       const err = new Error(message)
  //       err.status = HttpStatus.NOT_FOUND
  //
  //       return next(err)
  //     }
  //   }, (err) => next(err))
  //   .catch((err) => next(err))
}


module.exports = {
  getAllMeeting,
  getMeeting,
  addMeeting,
  updateMeeting,
  updateMeetingPrecloser,
  deleteMeeting,
  getUsersByMeeting,
  getMeetingsByGroup,
  getPaticipantByMeeting,
  orderedMeetingById,
  getOrderedMeetingById,
  getOrderedMeetingByEntity,
  orderedEntityMeetingById,
  getOrderPositionByMeeting,
  updateOrderPositionByMeeting,
  updateMeetingCloser
}
