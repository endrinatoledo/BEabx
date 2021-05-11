const express = require('express')
const PropertiesReader = require('properties-reader')

const originController = require('../controllers/originController')

const properties = PropertiesReader('./src/bin/common.properties')

const uriOrigins = properties.get('routes.api.origins')

const originRouter = express.Router()

originRouter.route(uriOrigins)
  .get(originController.getAllOrigin)

module.exports = originRouter
