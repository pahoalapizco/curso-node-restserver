
const express = require('express'); //Creamos la variable que tendra todos los elementos de express
const app = express(); // Inicializamos express dentro de la constante app
const bcrypt = require('bcrypt'); // libreria para encriptar 
const _ = require('underscore'); // libreria con propiedades para mejorar el desarrollo en js
const Usuario = require('../models/usuario');

const {
    PAGINA_INICIO_DEFAULT,
    MAX_PAGINA_DEFAULT
} = require('../config/globals')

app.get('/usuario', (req, res) => {
    // req.query = son los parametros opcionales recibidos de la url
    let desde  = Number(req.query.desde) || PAGINA_INICIO_DEFAULT
    let limite = Number(req.query.limite) || MAX_PAGINA_DEFAULT

    // find(Objeto con las condiciones que debe cumplir el resultado, string con los campos a retornar)
    Usuario.find({}, 'nombre email role google estado img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({}, (err, total) => {
                res.json({
                    ok: true,
                    total,
                    usuarios
                })
            })
        })
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
    //_.pick(obj con parametros obtenidos del body, arreglo de parametros que utilizaremos)
    // La función _.pick() nos regresa una copia del objeto original pero solo con los parametros qspecificados en el arreglo (2do parametro)
    let body = _.pick( req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    
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

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id
    Usuario.findByIdAndRemove(id,  (err, usuarioEliminado) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if(!usuarioEliminado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            usuarioEliminado
        })

    })
    

});

module.exports = app;