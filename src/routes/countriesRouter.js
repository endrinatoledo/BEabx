const express = require('express')
const PropertiesReader = require('properties-reader')

const properties = PropertiesReader('./src/bin/common.properties')

const countriesController = require('../controllers/countriesController')

const uriCountries = properties.get('routes.api.countries')

const countriesRouter = express.Router()

countriesRouter.route(uriCountries)
  .get(countriesController.fetchAll)

module.exports = countriesRouter
