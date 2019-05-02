const express = require('express')
const routes = express()

routes.use(require('./usuario'))
routes.use(require('./login'))
routes.use(require('./categoria'))

module.exports = routes