
const express = require('express'); //Creamos la variable que tendra todos los elementos de express
const app = express(); // Inicializamos express dentro de la constante app
const bcrypt = require('bcrypt'); // libreria para encriptar 
const _ = require('underscore'); // libreria con propiedades para mejorar el desarrollo en js
const Usuario = require('../models/usuario');

app.get('/usuario', (req, res) => {
    res.json('getUsuario');
  });
  
app.post('/usuario', (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        pass: bcrypt.hashSync(body.pass, 10), 
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

//:parametro <- valor que se envia por medio de la URL
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body =   _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    // Busca el registro y lo actualiza, filtrado por el id unico de cada archivo.
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true},(err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

         res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

   
});

app.delete('/usuario', (req, res) => {
    res.json('deleteUsuario');
});

module.exports = app;