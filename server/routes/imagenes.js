const express = require('express')
const fs = require('fs')
const path = require('path')
let { verificaToken, verificaTokenURL } = require('../middelwares/autenticacion')
const app = express()

app.get('/imagen/:tipo/:img', verificaTokenURL, (req, res) => {
  let {
    tipo,
    img
  } = req.params

  let pathImg = path.resolve(__dirname,  `../../uploads/${tipo}/${img}`)
  
  if( fs.existsSync(pathImg) ){
    res.sendFile(pathImg) 
  } else {
    let noImagen = path.resolve(__dirname,  `../assets/no-image.jpg`)
    res.sendFile(noImagen) 
  }
})

module.exports = app