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

// =======================
// VENCIMIENTO DEL TOKEN
// =======================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30 // 1 MES

// =======================
// SEED DE AUTENTICACIÓN 
// =======================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'