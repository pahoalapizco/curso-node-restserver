const jwt = require('jsonwebtoken')
// require('./config/config')

// Verificar Token
// next = continua con la ejecución del programa
let verificaToken = (req, res, next) => {
  let token = req.get('token')

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if(err){
      return res.status(401).json({
        ok: false,
        err
      })
    }
    req.usuario = decoded.usuario
    next()
  })
}

module.exports = {
  verificaToken
}