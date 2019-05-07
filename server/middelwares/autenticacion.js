const jwt = require('jsonwebtoken')
// require('./config/config')

// Verificar Token
// next = continua con la ejecución del programa
const verificaToken = (req, res, next) => {
  let token = req.get('token')

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if(err){
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no válido'
        }
      })
    }
    req.usuario = decoded.usuario
    next()
  })
}

// Verifica rol de usuario.
const verificaAdminRol = (req, res, next) => {
  let rolUsuario = req.usuario.role
  
  if (rolUsuario === 'ADMIN_ROLE'){
    next()
    return

  } else {
    return res.status(401).json({
      ok: false,
      err: {
        message: 'Usuario no cuenta con los persisos suficientes.'
      }
    })
  }
}

// Verifica token por la URL
const verificaTokenURL = (req, res, next) => {
  let token = req.query.token
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if(err){
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no válido'
        }
      })
    }
    req.usuario = decoded.usuario
    next()
  }) 
}

module.exports = {
  verificaToken,
  verificaAdminRol,
  verificaTokenURL
}