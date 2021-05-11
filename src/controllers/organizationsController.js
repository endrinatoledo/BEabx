const HttpStatus = require('http-status-codes')

const models = require('../models')

function fetchAll (req, res, next) {
  models.organizationsModel.findAll({
    include: [{
      model: models.countriesModel,
      as: 'countries'
    }]
  }).then(function (organizations) {
    res.status(HttpStatus.OK).json(organizations)
  }).catch(function (error) {
    error.status = HttpStatus.NOT_FOUND

    next(error)
  })
}

module.exports = {
  fetchAll
}
