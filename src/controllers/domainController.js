const HttpStatus = require('http-status-codes')
const PropertiesReader = require('properties-reader')
const Sequelize = require('sequelize')
const models = require('../models')
const Op = Sequelize.Op
const properties = PropertiesReader('./src/bin/common.properties')
const encbcrypt=require ('../utils/bcrypt');

function fetchAll (req, res, next) {
    models.domainsModel.findAll({
    }).then((domains) => {
        res.status(HttpStatus.OK).json({domains})
    }, (err) => next(err))
      .catch((err) => next(err))
  }

  async function getDomainByEmail(req, res, next) {
      
    try {

    let user  
    let email = req.params.email
    let domail = email.split('@');
    let statusUser
    const STATUSUSERGROUPPENDING = properties.get('const.grp.statusUserGroupPending')
    const ROLPART = properties.get('const.usr.rolPart')
    const DEFAULTPASSWORD = properties.get('const.usr.defaultPassword')
    const POSINVITED = properties.get('const.pos.posInvited')
    const USERPENDING = properties.get('const.usr.userPending')
    
    let message; 
    
      //consultar la existencia del dominio
      let resDomain = await models.domainsModel.findOne({where: { domExtension:domail[1]} }).catch(err => {
        throw err;
      });

      //consultar id del origen del grupo
      let oriGroup = await models.groupsModel.findOne({where: { id:req.params.idgroup} }).catch(err => {
        throw err;
      });

      user = await models.userModel.findOne({where: {email} }).catch(err => {
        throw err;
      });


      if(!resDomain && !user){
        statusUser = USERPENDING
      }else if(resDomain && !user){
        statusUser = USERPENDING
      }

      if((!resDomain && !user)||(resDomain && !user)){
        models.userModel.create({
          login:email,
          firstName: ' ',
          secondName:  ' ',
          lastName:  ' ',
          email,
          birthDate:Date.now(),
          createdAt:Date.now(),
          status:USERPENDING, 
          img:null,
          password:encbcrypt.encryptPWD(DEFAULTPASSWORD)
        }).then((user) => {
          //que organizacion se tomara por defecto?
          models.employeeModel.create({
            usrId:user.id,
            orgId:oriGroup.orgId,
            posId:POSINVITED,
            empStatus:1,
            createDate:Date.now(),
            updateDate:Date.now()
          })
          .then((employee) => {
            models.usersrolatrModel.create({
              usrId:user.id,
              grpId:req.params.idgroup,
              rolId:ROLPART,
              urgStatus: STATUSUSERGROUPPENDING
              })
              .then( (usersrolatr) =>{ 
                res.status(HttpStatus.OK).json(user)
              })
          }, (err) => {
            message = err//properties.get('message.res.errorInternalServer')
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message })
            next(err)
           })

        }, (err) => {
          message = err//properties.get('message.res.errorInternalServer')
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message })
          next(err)
         })
      }else if(user){
        models.usersrolatrModel.create({
          usrId:user.id,
          grpId:req.params.idgroup,
          rolId:ROLPART,
          urgStatus: STATUSUSERGROUPPENDING
          })
          .then( (usersrolatr) =>{ 
            res.status(HttpStatus.OK).json(user)
          },(err)=>{
            message = properties.get('message.res.errorInternalServer')
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message })
            next(err)
          }), (err) => {
            message = err//properties.get('message.res.errorInternalServer')
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message })
            next(err)
           }
      }
      
    } catch (e) {
        message = properties.get('message.res.errorInternalServer');
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message})
    }
      
  }


  function getDomainEmail (req, res, next) { 

    let email = req.params.email
    let domainEmail = email.split('@');

    models.domainsModel.findOne({
      where: {
        domExtension: domainEmail
      }
    }).then((domain) => {

      models.userModel.findOne({
        where: {email} 
      })
      .then((user) => {

        res.status(HttpStatus.OK).json({domain, user})

      }, (err) => next(err))
      .catch((err) => next(err))
    }, (err) => next(err))
      .catch((err) => next(err))
  }  

module.exports = {
  fetchAll,
  getDomainByEmail,
  getDomainEmail
}

