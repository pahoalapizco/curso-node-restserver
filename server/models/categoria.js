const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
  descripcion: {
    type: String,
    unique: true,
    required: [true, 'El nombre es de captura obligatoria.']
  },
  idUsuario: {
    type: String,
    required: [true, 'El usuario es requierido.']
  }
})

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único.'});

module.exports = mongoose.model('Categoria', categoriaSchema);