const express = require('express')
const Producto = require('../models/productos')
let { verificaToken, verificaAdminRol } = require('../middelwares/autenticacion')
const {
  PAGINA_INICIO_DEFAULT,
  MAX_PAGINA_DEFAULT
} = require('../config/globals')

const app = express()

// Obtener lista de todos los productos
app.get('/producto', verificaToken, (req, res) => {
  // req.query = son los parametros opcionales recibidos de la url
  let desde  = Number(req.query.desde) || PAGINA_INICIO_DEFAULT
  let limite = Number(req.query.limite) || MAX_PAGINA_DEFAULT

  Producto.find({})
    .skip(desde)
    .limit(limite)
    .populate('categoria', 'descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, produtosDB) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        })
      }
      if(!produtosDB){
        return res.status(500).json({
          ok: false,
          err:{
            message: 'No hay productos registrados.'
          } 
        })
      }
      res.json({
        ok: true,
        producto: produtosDB
      })
    })
})

// ===========
// TODO
// ===========
// Obtener un producto en especifico
app.get('/producto/:id', verificaToken, (req, res) => {
  // agregar populate: usuario y categoria

})

// Registrar nuevo producto 
app.post('/producto', verificaToken, (req, res) => {
  let body = req.body
  let usuario = req.usuario
  let producto =  new Producto ({
    nombre: body.nombre,
    precioUni: body.precio,
    descripcion: body.descripcion,
    categoria: body.categoria,
    usuario//: usuario.id
  })

  producto.save((err, productoDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if(!productoDB){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    res.json({
      ok: true,
      producto: productoDB
    })
  })
})

// ===========
// TODO
// ===========
// Actualizar un producto en especfico.
app.put('/producto/:id', verificaToken, (req, res) => {

})

// ===========
// TODO
// ===========
// Elimina un producto en especifico
app.delete('/producto/:id', [verificaToken, verificaAdminRol], (req, res) => {
  // cambiar el valor del key disponible a false
})

module.exports = app