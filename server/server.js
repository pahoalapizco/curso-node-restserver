require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path')
//Libreria para convertir los para metros de las peticiones post en un JSON
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Habilitar la carpeta public!
app.use(express.static(path.resolve(__dirname, '../public')))
// obtenemos las rutas de los servicios de usuarios
app.use(require('./routes/index'));

mongoose.connect(process.env.DB,
    { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if(err) throw err; // Regresa un error si no se pudo conectar a la BD
        
        console.log('Base de datos conectada...');
    });
app.listen(process.env.PORT, () => console.log(`Aplicación escuchando el puerto ${process.env.PORT}`));