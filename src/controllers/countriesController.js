const models = require('../models')

function fetchAll (req, res, next) {
  models.countriesModel.findAll().then(function (countries) {
    res.status(200).json(countries)
  }).catch(function (error) {
    next(error)
  })
}

module.exports = {
  fetchAll
}
