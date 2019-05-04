const express = require('express')
const Producto = require('../models/productos')
let { verificaToken, verificaAdminRol } = require('../middelwares/autenticacion')
const {
  PAGINA_INICIO_DEFAULT,
  MAX_PAGINA_DEFAULT
} = require('../config/globals')
const _ = require('underscore')
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
        return res.status(400).json({
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

// Obtener un producto en especifico
app.get('/producto/:id', verificaToken, (req, res) => {
  // agregar populate: usuario y categoria
  let _id = req.params.id

  Producto.findById({ _id })
    .populate('categoria', 'descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, productoBD) => {
      if(err){
        return res.status(500).json({
          ok: false,
          err
        })
      }
      if(!productoBD){
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Producto no encontrado.'
          }
        })
      }
      res.json({
        ok: true,
        producto: productoBD
      })
    })

})

app.get('/producto/buscar/:termino', (req, res) => {
  let termino = new RegExp( req.params.termino, 'i' )

  Producto.find({nombre: termino})
    .populate('categoria', 'nombre')
    .exec((err, productosBD) =>{
      if(err){
        return res.status(500).json({
          ok: false,
          err
        })
      }
      if(!productosBD || productosBD.length == 0){
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Producto no encontrado.'
          }
        })
      }
      res.json({
        ok: true,
        productos: productosBD
      })
    })
})
// Registrar nuevo producto 
app.post('/producto', verificaToken, (req, res) => {
  let body = req.body
  let usuario = req.usuario
  let producto =  new Producto ({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    categoria: body.categoria,
    usuario: usuario._id
  })
  producto.save((err, productoDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if(!productoDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Lo sentimos, ell producto no se ha registrado.'
        }
      })
    }
    res.json({
      ok: true,
      producto: productoDB
    })
  })
})

// Actualizar un producto en especfico.
app.put('/producto/:id', verificaToken, (req, res) => {
  let id = req.params.id
  let productoBody = req.body

  Producto.findByIdAndUpdate(id, productoBody, {new: true, runValidators: true},(err, productoBD) => {
      if(err){
        return res.status(500).json({
          ok: true,
          err
        })
      }
      if(!productoBD){
        return res.status(400).json({
            ok: false,
          err: {
            message: 'Producto no encontrado'
          }
        })
      }
      res.json({
        ok: true,
        producto: productoBD
      })
    })

})

// Elimina un producto en especifico
app.delete('/producto/:id', [verificaToken, verificaAdminRol], (req, res) => {
  // cambiar el valor del key disponible a false
  let id = req.params.id
  
  Producto.findByIdAndUpdate(id, { disponible: false }, {new: true}, (err, productoBD) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if(!productoBD){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Producto no encontrado'
        }
      })
    }
    res.json({
      ok: true,
      producto: productoBD
    })
  })
})

module.exports = app