
const express = require('express') //Creamos la variable que tendra todos los elementos de express
const app = express() // Inicializamos express dentro de la constante app
const bcrypt = require('bcrypt') // libreria para encriptar 
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require('../models/usuario')
const _ = require('underscore')

app.post('/login', (req, res) => {
  let {
    email,
    pass
  } = req.body

  Usuario.findOne({email: email}, (err, usuarioBD)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    //Si no encuentra el email ingresado por el usr o si la contraseña no coincide!!
    if(!usuarioBD || !bcrypt.compareSync(pass, usuarioBD.pass)){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o contraseña incorrectos.'
        }
      })
    } 
    let usuarioFiltrado =  _.pick( usuarioBD, ['nombre', 'email', 'img', 'role', 'estado'])

    let token = jwt.sign({ usuario: usuarioFiltrado }, 
        process.env.SEED, 
        { expiresIn: process.env.CADUCIDAD_TOKEN }
      )   
    res.json({
      ok: true,
      usuario: usuarioFiltrado,
      token
    })
  })
  
})

// Configuración para login con google!
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
  });
  const { name, email, picture } = ticket.getPayload();

  return {
    nombre: name,
    email,
    picture,
    google: true
  }
}

app.post('/google', async (req, res) => { 
  let gToken = req.body.idToken
  let googleUser 

  try {
    googleUser = await verify(gToken)
  } catch(err){
      return res.status(403).json({
        ok: false,
        err: {
          message: 'Token no valido'
        }
    })
  }
  
  Usuario.findOne({ email: googleUser.email }, (err, usuarioBD) =>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    // Validamos que la autenticación por google del usuario sea correcta
    if( usuarioBD ){
      if( !usuarioBD.google ){
        return res.status(403).json({
          ok: false,
          err: {
            message: 'Favor de iniciar sesión normal.'
          }
        })
      } else {
        let token = jwt.sign({  usuario: usuarioBD }, 
          process.env.SEED, 
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        )
        return res.status(200).json({
          ok: true,
          usuario: usuarioBD,
          token
        })
      }
    } else {
      let usuario = new Usuario({
        nombre: googleUser.nombre,
        email: googleUser.email,
        img: googleUser.picture,
        pass: ':)',
        google: true
      });

      usuario.save( (err, usuarioDB) => {
        if(err){
          return res.status(400).json({
              ok: false,
              err
          });
        }

        let token = jwt.sign({  usuario: usuarioDB }, 
          process.env.SEED, 
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        )
        res.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token
        })
      });
    }
  })
})
module.exports = app