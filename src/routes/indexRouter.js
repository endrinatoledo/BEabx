const express = require('express')
const HttpStatus = require('http-status-codes')

const router = express.Router()

router.get('/', function (req, res, next) {
  res.status(HttpStatus.OK).send('Express').end()
})

module.exports = router
