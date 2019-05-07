const express = require('express')
const routes = express()

routes.use(require('./usuario'))
routes.use(require('./login'))
routes.use(require('./categoria'))
routes.use(require('./producto'))
routes.use(require('./upload'))
routes.use(require('./imagenes'))

module.exports = routes