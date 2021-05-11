const HttpStatus = require('http-status-codes')
const PropertiesReader = require('properties-reader')

const models = require('../models')

const properties = PropertiesReader('./src/bin/common.properties')

function getAllOrigin (req, res, next) {
  let message

  models.originModel.findAll()
    .then((origin) => {
      message = properties.get('message.res.okData')
      res.status(HttpStatus.OK).json({ message, origin })
    }, (err) => {
      message = properties.get('message.res.errorInternalServer')
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message })

      next(err)
    })
}

module.exports = {
  getAllOrigin
}
