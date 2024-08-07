import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

//  Definir el esquema de la veterinario
const veterinarioSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  direccion: {
    type: String,
    trim: true,
    default: null
  },
  telefono: {
    type: Number,
    trim: true,
    default: null
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  token: {
    type: String,
    default: null
  },
  confirmEmail: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

// Metodo para cifrar la contraseña
veterinarioSchema.methods.encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10)
  const passwordEmcrypt = await bcrypt.hash(password, salt)
  return passwordEmcrypt
}

// Metodo para verificar si el password es correcto en la base de datos
veterinarioSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

// Metodo para crear un token(OTP)
veterinarioSchema.methods.createToken = async function () {
  const tokenGenerado = this.token = Math.random().toString(36).slice(2)
  return tokenGenerado
}

// Exportar el modelo de la veterinario
export default model('Veterinario', veterinarioSchema)
