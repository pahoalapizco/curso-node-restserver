// =======================
// PUERTO
// =======================

process.env.PORT = process.env.PORT || 3000

// =======================
// ENTORNO
// =======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// =======================
// BASE DE DATOS
// =======================

let DB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.BD_URI

process.env.DB = DB