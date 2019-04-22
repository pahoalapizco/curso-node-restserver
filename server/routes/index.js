const express = require('express');
const routes = express();

routes.use(require('./usuario'));
routes.use(require('./login'));

module.exports = routes