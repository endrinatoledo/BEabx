const express = require('express')
const PropertiesReader = require('properties-reader')

const properties = PropertiesReader('./src/bin/common.properties')

const organizationsController = require('../controllers/organizationsController')

const uriOrganization = properties.get('routes.api.organizations')

const organizationsRouter = express.Router()

organizationsRouter.route(uriOrganization)
  .get(organizationsController.fetchAll)

module.exports = organizationsRouter
