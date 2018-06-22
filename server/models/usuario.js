
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let rolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un role válido.'
}
// Comienza creación del modelo de usuarios, aquí se mapea el usuario obtenido desde el front a el usuario de BD
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es de captura obligatoria.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es de captura obligatoria.']
    },
    pass: {
        type: String,
        required: [true, 'Es obligatorio capturar la contraseña']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function (){
    let user = this;
    let userObject = user.toObject();
    delete userObject.pass;
    
    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único.'});
// mongoose.modelnombre real del modelo, configuraciòn que tendra el modelo real 'Usuario')
module.exports = mongoose.model('Usuario', usuarioSchema);