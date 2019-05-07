const express = require('express')
const fileUpload = require('express-fileupload')
const Usuario = require('../models/usuario')
const Producto = require('../models/productos')
const fs = require('fs')
const path = require('path')
 
const app = express()

app.use(fileUpload({ useTempFiles: true }))

app.put('/upload/:tipo/:id', (req, res) => {
  let {
    tipo,
    id
  } = req.params
  
  try {
    let archivo = req.files.archivo
    let tipoArchivoValido = ['productos', 'usuarios']
    let extencionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG','JPEG', 'GIF']
    let nombreSeccionado = archivo.name.split('.')
    let extencion = nombreSeccionado[nombreSeccionado.length - 1]
  
    //Valida tipo de archivo
    if(tipoArchivoValido.indexOf(tipo) < 0){
      return res.status(400).json({
        ok: false,
        err: {
          message: `Los tipos de archivos validos son ${tipoArchivoValido.join(', ')}`,
          tipo
        }
      })
    }
  
    //Valida extención del archivo
    if(extencionesValidas.indexOf(extencion) < 0){
      return res.status(400).json({
        ok: false,
        err: {
          message: `Las extenciones validas son ${extencionesValidas.join(', ')}`,
          extencion
        }
      })
    }
  
    if(!req.files){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'No se a cargado ningun archivo.'
        }
      })
    }
  
    //Define nuevo nombre del archivo a cargar en svr
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extencion}`
  
    //.mv mueve el archivo al path especificado
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
      if (err){
        return res.status(500).json({
          ok: false,
          err
        })
      }
      
     switch(tipo){
      case 'usuarios':
        imagenUsuario(id, res, nombreArchivo)
        break;
      case 'productos':
        imagenProducto(id, res, nombreArchivo)
        break;
     }
  
    })

  } catch( err ){
    res.status(500).json({
      ok: false,
      err: {
        message: 'Favor de cargar una imagen'
      }
    })
  }
})

const imagenUsuario = (id, res, nombreArchivo) => {
  Usuario.findById(id, (err, usuarioDB) => {
    if(err){
      borrarImagen(nombreArchivo, 'usuarios')

      return res.status(500).json({
        ok: false,
        err
      })
    }
    
    if(!usuarioDB){
      borrarImagen(nombreArchivo, 'usuarios')

      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no registrado'
        }
      })
    }
    borrarImagen(usuarioDB.img , 'usuarios')
    
    usuarioDB.img = nombreArchivo

    usuarioDB.save((err, usuarioActualizado) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        })
      }
      res.json({
        ok: true,
        usuario: usuarioActualizado
      })
    })

  })
}

const imagenProducto = (id, res, nombreArchivo) => {
  Producto.findById(id, (err, productoDB) => {
    if(err){
      borrarImagen(nombreArchivo, 'productos')

      return res.status(500).json({
        ok: false,
        err
      })
    }
    
    if(!productoDB){
      borrarImagen(nombreArchivo, 'productos')
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Producto no registrado'
        }
      })
    }
    borrarImagen(productoDB.img , 'productos')
    
    productoDB.img = nombreArchivo

    productoDB.save((err, productoActualizado) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        })
      }
      res.json({
        ok: true,
        producto: productoActualizado
      })
    })

  })
}

const borrarImagen = (nombreImagen, tipo) => {
  // Verifica si el usuario tiene imagenes cargadas para así reemplazarla en el SVR
  let pathImg = path.resolve(__dirname,  `../../uploads/${tipo}/${nombreImagen}`)

  if( fs.existsSync(pathImg) ){
    fs.unlink(pathImg)
  }
}

module.exports = app