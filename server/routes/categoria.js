const express = require('express')
const Categoria = require('../models/categoria')
let { verificaToken, verificaAdminRol } = require('../middelwares/autenticacion')

const app = express()

// Obtener todas las categorias existentes en BD
app.get('/categoria', verificaToken, (req, res) =>{
  Categoria.find({})
  .sort('descripcion')
  .populate('usuario', 'nombre email')
  .exec((err, categoriasBD) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    res.json({
      ok: true,
      categorias: categoriasBD
    })
  })
})

// Obtener una categoria en especifico
app.get('/categoria/:id', verificaToken, (req, res) => {
  let _id = req.params.id

  Categoria.findById({ _id }, (err, categoriaBD) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if(!categoriaBD) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'La categoria no encontrada.'
        }
      })
    } else {
      res.json({
        ok: true,
        categoria: categoriaBD
      })
    }
  })
})

// Registrar categorias
app.post('/categoria', verificaToken, (req, res)=>{
  let descripcion = req.body.descripcion
  let usuario = req.usuario
  let categoria = new Categoria({
    descripcion,
    usuario
  })
  categoria.save((err, categoriaDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if(!categoriaDB){
      return res.status(400).json({
        ok: false,
        err
      })
    }
    res.json({
      ok: true,
      categoriaDB
    })
  })
})

// Actualizar categoria, PENDIENTE
app.put('/categoria/:id', verificaToken, (req, res) => {
  let id = req.params.id
  let descCategoria ={
    descripcion: req.body.descripcion
  } 

  Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {
      if(err){
        return res.status(400).json({
          ok: false,
          err
        });
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  })
})

app.delete('/categoria/:id', [verificaToken, verificaAdminRol], (req, res) => {
  let id = req.params.id

  Categoria.findByIdAndDelete({ _id: id }, (err, categoriaEliminada) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if(!categoriaEliminada){
      res.status(400).json({
        ok: false,
        err: {
          message: 'Categoria no encontrada.'
        }
      })
    }
    res.json({
      ok: true,
      message: 'Categoria eliminada correctamente.'
    })
  })
  
})

module.exports = app