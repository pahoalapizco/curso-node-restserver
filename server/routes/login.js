
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

    let token = jwt.sign({
        usuario: usuarioFiltrado
      }, 
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
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  console.log(payload.name)
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}
// verify().catch(console.error);

app.post('/google', (req, res) => { 
  let gToken = req.body.idToken
  verify(gToken)

  res.json({
    gToken
  })
})
module.exports = app