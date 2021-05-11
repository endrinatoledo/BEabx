const express = require('express')
const PropertiesReader = require('properties-reader')

const properties = PropertiesReader('./src/bin/common.properties')

const domainController = require('../controllers/domainController')

const uridomains = properties.get('routes.api.domains')
const uriDomainByEmail = properties.get('routes.api.domainbyemail')
const uriDomainEmail = properties.get('routes.api.domainemail')

const domainsRouter = express.Router()

domainsRouter.route(uridomains)
  .get(domainController.fetchAll)

domainsRouter.route(uriDomainByEmail)
  .get(domainController.getDomainByEmail)  

domainsRouter.route(uriDomainEmail)
  .get(domainController.getDomainEmail) 
  
module.exports = domainsRouter
