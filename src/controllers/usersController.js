const HttpStatus = require('http-status-codes')
const PropertiesReader = require('properties-reader')
const Sequelize = require('sequelize')
const password = require('../utils/generatePassword')
const models = require('../models')
const encryptPasswprd = require('../utils/encryptPassword');
const encbcrypt = require('../utils/bcrypt');
const encrypEmail = require('../utils/encryptJs')
const Op = Sequelize.Op
const groups = require('../controllers/groupsController')
const meetings = require('../controllers/meetingController')
const properties = PropertiesReader('./src/bin/common.properties')
const {encryptPassword, comprarePassword} = require('../utils/bcrypt');
const jwt = require('jsonwebtoken');

function getAllByAssociatedGroups(req, res, next) {
  let message
  let idGroup
  const idUsr = req.params.id
  models.groupsModel.findAll({
    attributes: ['grp_id'],
    include: [{
      model: models.usersrolatrModel,
      as: 'usersrolatr',
      where: {usr_id: idUsr},
      attributes: []
    }]
  }).then((data) => {
    if (Array.isArray(data)) {
      idGroup = data.map(x => {
        return x.dataValues.grp_id
      })
    }
    models.userModel.findAll({
      include: [{
        model: models.usersrolatrModel,
        as: 'usersrolatr',
        attributes: [],
        where: {
          grpId: {
            [Op.in]: idGroup
          }
        }
      }]
    }).then((users) => {
      message = properties.get('message.res.okData')
      res.status(HttpStatus.OK).json({message, users})
    }).catch((err) => {
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

function getAllByGroupId(req, res, next) {
  let message

  const idGrp = req.params.id
  models.userModel.findAll({
    include: [{
      model: models.usersrolatrModel,
      as: 'usersrolatr',
      attributes: [],
      where: {grp_id: idGrp}
    }]
  }).then((users) => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, users})
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })
}

function getUserByemail(req, res, next) {
  let message
  const emailUser = req.params.email
  models.userModel.findOne({
    where: {
      email: emailUser
    }
  }).then((user) => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, user})
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })

}

function getStatusByUser(req, res, next) {
  let status
  models.userModel.findOne({
    where: {
      id: req.params.id
    }
  }).then((user) => {
    status = user.status;
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({status})
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })

}

function getRolByUser(req, res, next) {
  let message
  const Id = req.params.id
  models.userModel.findOne({
    where: {
      userId: Id
    }
  }).then((rol) => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, rol})
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })

}

function getUserById(req, res, next) {
  let message
  const idUser = req.params.id
  models.userModel.findOne({
    where: {
      id: req.params.id
    }
  }).then((user) => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, user})
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })

}

function getAllUserByOrgName(req, res, next) {
  let message
  models.userModel.findOne({
    include: [{
      model: models.employeeModel,
      as: 'employee',
      include: [{
        model: models.organizationsModel,
        as: 'organization',
        where: {
          orgName: req.params.orgName
        }
      }]
    }],
    where: {
      login: {
        [Op.like]: `%${req.params.userName}%`
      }
    }
  }).then((users) => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, users})
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })

}

function getOrgbyIdUser(req, res, next) {
  const idUser = req.params.id
  models.employeeModel.findOne({
    where: {
      usrId: idUser
    }
  }).then((employee) => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, employee})
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })


}

function getAllUserActByOrg(req, res, next) {
  let message
  const STATUSACT = properties.get('const.emp.statusAct')
  const idOrg = req.params.idorg
  models.userModel.findAll({
    include: [{
      model: models.employeeModel,
      as: 'employee',
      where: {
        orgId: idOrg,
        empStatus: STATUSACT
      }
    }]
  }).then((users) => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, users})
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })
}

function addUser(req, res, next) {
  if (!req.body.login || !req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) return res.status(406).json({ok: false, message: 'Los campos son obligatorios'});
  models.userModel.create({
    login: req.body.login,
    firstName: req.body.firstName,
    secondName: req.body.secondName,
    lastName: req.body.lastName,
    email: req.body.email,
    birthDate: req.body.birthdate,
    createdAt: Date.now(),
    status: 0,
    img: null,
    password: encbcrypt.encryptPWD(req.body.password)
  }).then((user) => {
      models.employeeModel.create({
        usrId: user.id,
        orgId: req.body.idOrg,
        posId: 1,
        empStatus: 1,
        createDate: Date.now(),
        updateDate: Date.now()
      }).then(() => {
        models.usersrolatrModel.create({
          usrId: user.id,
          grpId: req.body.grpId,
          rolId: '2',
          urgStatus: 1
        }).then(() => {
          res.status(HttpStatus.OK).json(user)
        })
      })
    }, (err) => {
      message = err//properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
      next(err)
    }
  )

}

function getAllUserByOrg(req, res, next) {
  let message
  const idOrg = req.params.idorg
  models.userModel.findAll({
    include: [{
      model: models.employeeModel,
      as: 'employee',
      where: {orgId: idOrg}
    }]
  }).then((users) => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, users})
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })

}

function getAllUser(req, res, next) {
  let message
  models.userModel.findAll({}).then((users) => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, users})
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })

}

function getPartByGroup(req, res, next) {
  let message
  const idGroup = req.params.id
  models.userModel.findAll({
    include: [{
      model: models.usersrolatrModel,
      as: 'usersrolatr',
      where: {grpId: idGroup}
    }]
  }).then((users) => {
    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({message, users})
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })

}

function getRolByUser(req, res, next) {
  let message
  models.usersrolatrModel.findOne({
    where: {
      usrId: req.params.id,
      grpId: req.params.groupId
    }
  }).then((rol) => {

    message = properties.get('message.res.okData')
    res.status(HttpStatus.OK).json({rol})
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })

}

function updatePasswordByEmail(req, res, next) {
  let message
  models.userModel.findOne({
    where: {
      email: req.params.email
    }
  })
    .then((user) => {
      if (user) {
        let newPassword = password(10, 'alf');
        user.update({
          password: encbcrypt.encryptPWD(newPassword),
          status: 3
        }).then((user) => {
          message = 'cambio de clave exitoso'
          res.status(HttpStatus.OK).json({message, newPassword})
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

function resetPasswordByUser(req, res, next) {
  let message
  let {currentPassword} = req.body;
  models.userModel.findOne({
    where: {
      // password: encryptPasswprd.encrypt(req.body.password).encryptedData,
      id: req.params.id
    }
  }).then(async user => {
    if (user) {
      if (comprarePassword(user.dataValues.password, currentPassword) !== true) return res.status(406).json({ok: false, message: 'contraseña Actual invalida'});
      await user.update({
        password: encbcrypt.encryptPWD(req.body.newPassword),
        status: 1
      }).then((user) => {
        message = 'cambio de clave exitoso'
        return res.status(HttpStatus.OK).json({message})
      }, (err) => {
        message = 'Contraseña incorrecta'
        return res.status(HttpStatus.OK).json({message})
      })
    } else {
      message = 'Contraseña incorrecta'
      return res.status(HttpStatus.OK).json({message})
    }
  }, (err) => next(err))
    .catch((err) => next(err))
}

function updateStatusByUser(req, res, next) {
  let message
  models.userModel.findOne({
    where: {
      id: req.params.id
    }
  })
    .then((user) => {
      if (user) {
        user.update({
          status: req.params.status,

        }).then((user) => {
          message = 'cambio de status exitoso'
          res.status(HttpStatus.OK).json({message})
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

function getUpdateStatusByEmail(req, res, next) {
  let message
  models.userModel.findOne({
    where: {
      email: encrypEmail.decrypt(req.params.encryp)
    }
  })
    .then((user) => {
      if (user) {
        user.update({
          status: 1
        }).then((user) => {
          message = 'cambio de status exitoso'
          res.status(HttpStatus.OK).json({message})
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

function userLogin(req, res, next) {
  let message;
  const emailUser = req.body.email;
  const passUser = req.body.password;
  models.userModel.findOne({
    where: {
      email: emailUser
    }
  }).then((user) => {
    if (user === null) {
      message = "Usuario o contraseña inválidos"
      return res.status(HttpStatus.OK).json({message})
    } else {
      if (comprarePassword(user.password, passUser) === false) {
        message = "Clave inválida"
        return res.status(HttpStatus.OK).json({message})
      } else {
        // Creamos el token con el informacion necesario para el front
        let token = jwt.sign(// por defecto el algoritmo de encriptaicon es SHA-256, pero otro puede ser especificado
          {// playload del token
            id: user.id,
            name: `${user.firstName} ${user.lastName}`
          },
          (process.env.JWT_SECRET), // llave para el token
          {expiresIn: '12h'} // tiempo de expiracion
        );
        user.dataValues.token = token;
        return res.status(HttpStatus.OK).json({message, user})
      }
    }
  }, (err) => {
    message = properties.get('message.res.errorInternalServer')
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})

    next(err)
  })

}

/**
 * Metodo encargado de validar el token almacenado en el local storage del front-end. Esta ejecucion es sincrona.
 * @param req
 * @param res
 * @param next
 * @returns Http 200 ok
 */
function checkToken(req, res, next) {
  let token = req.body.token;
  try {
    let verification = jwt.verify(token, (process.env.JWT_SECRET));
    return res.status(HttpStatus.OK).json(verification);
  } catch (err) {
    let message = err.message; // Puede ser que expiro la sesion, el token no es valido.
    return res.status(HttpStatus.OK).json({message})
  }
}

function getAllByRolAndUser(req, res, next) {
  let message
  let urgStatus = properties.get('const.grp.urgStatus')
  let usrId = req.params.idUser
  let rolId = req.params.idRol
  let idGroups = []
  let idMeetings = []
  let rolObject = new Object

  models.usersrolatrModel.findAll({
    where: {
      urgStatus,
      usrId,
      rolId: {
        [Op.like]: `%${rolId}%`
      },

    }
  }).then((rol) => {


    if (rol[0] == undefined) {
      message = properties.get('message.usr.res.notDataRol')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
    }

    rolObject.rol = rol

    userById(usrId)
      .then(usr => {
        if (usr == null) {
          rolObject.user = null
        }
        rolObject.user = usr

        rol.forEach(
          element => {

            idGroups.push(element.grpId)
          })

        models.groupsModel.findAll({
          where: {
            grp_id: {
              [Op.in]: idGroups
            }
          }
        }).then(groups => {

          if (groups[0] == undefined) {
            rolObject.groups = null
          }

          rolObject.groups = groups

          models.meetingModel.findAll({
            where: {
              grp_id: {
                [Op.in]: idGroups
              }
            }
          }).then(meetings => {

            if (meetings[0] == undefined) {
              rolObject.meetings = null
            }
            meetings.forEach(
              meeting => {

                idMeetings.push(meeting.id)
              })
            rolObject.meetings = meetings

            models.agreementModel.findAll({
              where: {
                grp_id: {
                  [Op.in]: idGroups
                }
              }
            }).then(agreements => {
              if (agreements[0] == undefined) {
                rolObject.agreements = null
              }
              rolObject.agreements = agreements

              models.assignmentsModel.findAll({
                where: {
                  grp_id: {
                    [Op.in]: idGroups
                  }
                },
                order: [['finalDate', 'ASC']]

              }).then(assignments => {
                if (assignments[0] == undefined) {
                  rolObject.assignments = null
                }
                rolObject.assignments = assignments

                models.notesModel.findAll({
                  where: {
                    meeId: {
                      [Op.in]: idMeetings
                    }
                  }
                }).then(notes => {
                  if (notes[0] == undefined) {
                    rolObject.notes = null
                  }
                  rolObject.notes = notes
                  let obje = sortAndGroup(rolObject)

                  res.status(HttpStatus.OK).json({obje})

                })
                  .catch((err) => {
                    message = properties.get('message.res.errorInternalServer')
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
                    next(err)
                  })
              })
                .catch((err) => {
                  message = properties.get('message.res.errorInternalServer')
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
                  next(err)
                })
            })
              .catch((err) => {
                message = properties.get('message.res.errorInternalServer')
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
                next(err)
              })
          })
            .catch((err) => {
              message = properties.get('message.res.errorInternalServer')
              res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
              next(err)
            })
        })
          .catch((err) => {
            message = properties.get('message.res.errorInternalServer')
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
            next(err)
          })

      }, (err) => {
        message = properties.get('message.res.errorInternalServer')
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
        next(err)
      })
      .catch((err) => {
        message = properties.get('message.res.errorInternalServer')
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
        next(err)
      })
  })
}

function sortAndGroup(obj) {

  let rolPart = properties.get('const.usr.rolPart')
  let rolGroup = obj.rol
  let user = obj.user
  let groups = obj.groups
  let meetings = obj.meetings
  let assignments = obj.assignments
  let agreements = obj.agreements
  let notes = obj.notes
  let aux = []
  let rolObject = []
  let tempObject = []
  let arrayMee = []


  //Se ordena objeto de rol y grupos
  rolGroup.forEach(itemRol => {
    groups.forEach(itemGroup => {
      if (itemGroup.id == itemRol.grpId) {
        rolObject.push({
          rol: itemRol,
          group: itemGroup
        })
      }
    })
  })

  //Se agrega objeto de reuniones por grupo
  rolObject.forEach(itemRol => {

    aux = []
    if (meetings != null) {
      meetings.forEach(meeting => {
        //valida que estemos en el grupo correcto
        if (meeting.grpId == itemRol.rol.grpId) {
          aux.push(meeting)
        }
      })
    }

    tempObject.push({
      rol: itemRol.rol,
      group: itemRol.group,
      meetings: aux
    })


  })
  rolObject = []
  rolObject = tempObject
  tempObject = []
  //agregando asignaciones
  rolObject.forEach(itemRol => {
    //capturar rol de lider o administrador
    aux = []
    if (assignments != null) {
      assignments.forEach(assignment => {
        //valida que estemos en el grupo correcto
        if (assignment.grpId == itemRol.rol.grpId) {
          //Si tiene rol de participante solo podra ver sus asignaciones
          if (itemRol.rol.rolId == rolPart) {

            if (assignment.usrId == user.id) {
              aux.push(assignment)
            }
          } else {
            aux.push(assignment)
          }

        }
      })
    }
    tempObject.push({
      rol: itemRol.rol,
      group: itemRol.group,
      meetings: itemRol.meetings,
      assignments: aux
    })

  })
  rolObject = []
  rolObject = tempObject
  tempObject = []

  //agregando acuerdos
  rolObject.forEach(itemRol => {
    //capturar rol de lider o administrador
    aux = []
    if (agreements != null) {
      agreements.forEach(agreement => {
        if (agreement.grpId == itemRol.rol.grpId) {
          aux.push(agreement)
        }
      })
    }
    tempObject.push({
      rol: itemRol.rol,
      group: itemRol.group,
      meetings: itemRol.meetings,
      assignments: itemRol.assignments,
      agreements: aux
    })

  })

  rolObject = []
  rolObject = tempObject
  tempObject = []

  //agregando acuerdos
  rolObject.forEach(itemRol => {
    //capturar rol de lider o administrador
    aux = []
    if (notes != null) {
      notes.forEach(note => {
        arrayMee = itemRol.meetings
        arrayMee.forEach(meet => {
          if (meet.id == note.meeId) {
            aux.push(note)
          }
        })

      })
    }
    tempObject.push({
      rol: itemRol.rol,
      group: itemRol.group,
      meetings: itemRol.meetings,
      assignments: itemRol.assignments,
      agreements: itemRol.agreements,
      notes: aux
    })

  })

  tempObject.push(user)
  rolObject = []
  rolObject = tempObject
  return rolObject

}

function userById(id) {
  const USERACTIVE = properties.get('const.usr.userAct')
  return models.userModel.findOne({
    where: {
      id,
      status: USERACTIVE
    }
  })
}

const userUpdate = async (req, res) => {
  try {
    const {id} = req.params;
    let newBody = {};
    for (let prop in req.body) {
      if (req.body[prop] !== null) {
        newBody[prop] = req.body[prop]
      }
    }
    let {login, email} = newBody;
    if (!req.body) return res.status(400).json({ok: false, message: 'Se requieren los datos'});
    if (login) return res.status(406).json({ok: false, message: 'No es posible Modificar el campo Nombre de usuario'});
    if (email) return res.status(406).json({ok: false, message: 'No es posible Modificar el campo email'});
    let user = await models.userModel.findOne({where: {id}}).catch(err => {
      throw err
    });
    await user.update(newBody).catch(err => {
      throw err
    })
    return res.status(HttpStatus.OK).json({ok: true, message: 'Datos Actualizados'});
  } catch (err) {
    let message = properties.get('message.res.errorInternalServer')
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
  }
}

module.exports = {
  getAllByAssociatedGroups,
  getAllByGroupId,
  addUser,
  getUserByemail,
  getUserById,
  getOrgbyIdUser,
  getAllUserByOrg,
  getPartByGroup,
  getRolByUser,
  getStatusByUser,
  updatePasswordByEmail,
  updateStatusByUser,
  resetPasswordByUser,
  getAllUserByOrgName,
  getAllUser,
  getUpdateStatusByEmail,
  userLogin,
  getAllUserActByOrg,
  getAllByRolAndUser,
  userUpdate,
  checkToken
}
