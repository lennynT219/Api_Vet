import { sendMailToUser, sendMailToRecoveryPassord } from '../config/nodemailes.js'
import { createToken } from '../middlewares/auth.js'
import Veterinario from '../models/Veterinario.js'
import mongoose from 'mongoose'

/*
-Actividad 1: Recibir el request
-Actividad 2: Validar la información recibida
-Actividad 3: Enviar la información a la base de datos
-Actividad 4: Responder al cliente
*/

const login = async (req, res) => {
  // Actividad 1
  const { email, password } = req.body

  // Actividad 2
  if (Object.values(req.body).includes('')) return res.status(404).json({ msg: 'Faltan Datos' }) // Verifica si algun campo esta vacio
  const veterinarioBDD = await Veterinario.findOne({ email })

  if (veterinarioBDD?.confirmEmail === false) return res.status(403).json({ msg: 'Confirma tu cuenta' }) // Verifica si la cuenta esta confirmada

  if (!veterinarioBDD) return res.status(404).json({ msg: 'Email no registrado' }) // Verifica si el email esta registrado

  const verificarPassword = await veterinarioBDD.matchPassword(password)
  if (!verificarPassword) return res.status(404).json({ msg: 'Contraseña incorrecta' }) // Verifica si la contraseña es correcta

  // Actividad 3
  const { nombre, apellido, direccion, telefono, _id } = veterinarioBDD
  const token = createToken(veterinarioBDD._id, 'veterinario')

  // Actividad 4
  res.status(202).json({
    nombre,
    apellido,
    direccion,
    telefono,
    _id,
    email: veterinarioBDD.email,
    rol: 'veterinario',
    token
  })
}

const perfil = (req, res) => {
  delete req.veterinarioBDD.token
  delete req.veterinarioBDD.confirmEmail
  delete req.veterinarioBDD.createdAt
  delete req.veterinarioBDD.updatedAt
  delete req.veterinarioBDD.__v
  res.status(200).json(req.veterinarioBDD)
}

const registro = async (req, res) => {
  // Actividad 1
  const { email, password } = req.body

  // Actividad 2
  if (Object.values(req.body).includes('')) { // Verifica si algun campo esta vacio
    return res.status(400).json({ msg: 'Faltan datos' })
  }
  const verificarEmailBDD = await Veterinario.findOne({ email })
  if (verificarEmailBDD) return res.status(400).json({ msg: 'El email ya se encuentra registrado' }) // Verifica si el email ya esta registrado

  // Actividad 3
  const nuevoVeterinario = new Veterinario(req.body)
  nuevoVeterinario.password = await nuevoVeterinario.encryptPassword(password)
  const token = await nuevoVeterinario.createToken()
  sendMailToUser(email, token)
  await nuevoVeterinario.save() // Guarda el nuevo veterinario en la base de datos

  // Actividad 4
  res.status(200).json({ msg: 'Revisa tu correo electronico para confirmar tu cuenta' })
}

const confirmEmail = async (req, res) => {
  // Actividad 1
  if (!(req.params.token)) return res.status(400).json({ msg: 'Lo sentimos, no se puede validar la cuenta' })

  // Actividad 2
  const veterinarioBDD = await Veterinario.findOne({ token: req.params.token })
  if (!veterinarioBDD?.token) return res.status(404).json({ msg: 'La cuenta ya ha sido confirmada' })

  // Actividad 3
  veterinarioBDD.token = null
  veterinarioBDD.confirmEmail = true
  await veterinarioBDD.save()

  // Actividad 4
  res.status(200).json({ msg: 'Token confirmado, ya puedes iniciar sesión' })
}

const listarVeterinarios = (req, res) => {
  res.status(200).json({ res: 'lista de veterinarios registrados' })
}
const detalleVeterinario = (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: 'Veterinario no encontrado' }) // Verifica si el id es valido
  const veterinarioBDD = Veterinario.findById(id).select('-password') // Busca el veterinario por id
  if (!veterinarioBDD) return res.status(404).json({ msg: 'Veterinario no encontrado' }) // Verifica si el veterinario esta registrado
  res.status(200).json({ msg: veterinarioBDD })
}
const actualizarPerfil = async (req, res) => {
  // Actividad 1
  const { id } = req.params

  // Actividad 2
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: 'Lo sentimos, debe ser un id válido' })
  if (Object.values(req.body).includes('')) return res.status(400).json({ msg: 'Lo sentimos, debes llenar todos los campos' })
  const veterinarioBDD = await Veterinario.findById(id)
  if (!veterinarioBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el veterinario ${id}` })
  if (veterinarioBDD.email !== req.body.email) {
    const veterinarioBDDMail = await Veterinario.findOne({ email: req.body.email })
    if (veterinarioBDDMail) {
      return res.status(404).json({ msg: 'Lo sentimos, el existe ya se encuentra registrado' })
    }
  }

  // Actividad 3
  veterinarioBDD.nombre = req.body.nombre || veterinarioBDD?.nombre
  veterinarioBDD.apellido = req.body.apellido || veterinarioBDD?.apellido
  veterinarioBDD.direccion = req.body.direccion || veterinarioBDD?.direccion
  veterinarioBDD.telefono = req.body.telefono || veterinarioBDD?.telefono
  veterinarioBDD.email = req.body.email || veterinarioBDD?.email
  await veterinarioBDD.save()

  // Actividad 4
  res.status(200).json({ msg: 'Perfil actualizado correctamente' })
}

const actualizarPassword = async (req, res) => {
  // Actividad 1
  const veterinarioBDD = await Veterinario.findById(req.veterinarioBDD._id)
  console.log(veterinarioBDD)
  // Actividad 2
  if (!veterinarioBDD) return res.status(404).json({ msg: 'Veterinario no encontrado' }) // Verifica si el veterinario esta registrado
  if (Object.values(req.body).includes('')) return res.status(404).json({ msg: 'Faltan Datos' }) // Verifica si algun campo esta vacio
  const verificarPassword = await veterinarioBDD.matchPassword(req.body.passwordactual)
  if (!verificarPassword) return res.status(404).json({ msg: 'Contraseña incorrecta' }) // Verifica si la contraseña es correcta

  // Actividad 3
  veterinarioBDD.password = await veterinarioBDD.encryptPassword(req.body.passwordnuevo)
  await veterinarioBDD.save()

  // Actividad 4
  res.status(200).json({ msg: 'Contraseña actualizada' })
}

const recuperarPassword = async (req, res) => {
  // Actividad 1
  const { email } = req.body

  // Actividad 2
  if (!email) return res.status(400).json({ msg: 'Falta el email' }) // Verifica si el email esta vacio
  if (Object.values(req.body).includes('')) return res.status(404).json({ msg: 'Faltan Datos' }) // Verifica si algun campo esta vacio
  const veterinarioBDD = await Veterinario.findOne({ email })
  if (!veterinarioBDD) return res.status(404).json({ msg: 'Email no registrado' }) // Verifica si el email esta registrado

  // Actividad 3
  const token = await veterinarioBDD.createToken()
  veterinarioBDD.token = token
  sendMailToRecoveryPassord(email, token)
  await veterinarioBDD.save()

  // Actividad 4
  res.status(200).json({ msg: 'Revisa tu correo electronico para recuperar tu contraseña' })
}

const comprobarTokenPasword = async (req, res) => {
  // Actividad 1 y 2
  if (!(req.params.token)) return res.status(404).json({ msg: 'Lo sentimos, no se puede validar la cuenta' })
  const veterinarioBDD = await Veterinario.findOne({ token: req.params.token })

  if (veterinarioBDD?.token !== req.params.token) return res.status(404).json({ msg: 'Token invalido' })

  // Actividad 3
  await veterinarioBDD.save()

  // Actividad 4
  res.status(200).json({ msg: 'Token confirmado, ya puedes cambiar tu contraseña' })
}

const nuevoPassword = async (req, res) => {
  // Actividad 1
  const { password, confirmpassword } = req.body

  // Actividad 2
  if (password !== confirmpassword) return res.status(400).json({ msg: 'Las contraseñas no coinciden' }) // Verifica si las contraseñas coinciden

  const veterinarioBDD = await Veterinario.findOne({ token: req.params.token })

  if (veterinarioBDD?.token !== req.params.token) return res.status(404).json({ msg: 'Token invalido' })

  // Actividad 3
  veterinarioBDD.token = null
  veterinarioBDD.password = await veterinarioBDD.encryptPassword(password)
  await veterinarioBDD.save()

  // Actividad 4
  res.status(200).json({ msg: 'Contraseña actualizada' })
}

const actualizarEmail = async (req, res) => {
  const { email } = req.body
  const verificarEmailBDD = await Veterinario.findOne({ email })
  if (verificarEmailBDD) return res.status(400).json({ msg: 'El email ya se encuentra registrado' }) // Verifica si el email ya esta registrado

  const veterinarioBDD = await Veterinario.findById(req.veterinarioBDD._id)
  veterinarioBDD.email = email
  verificarEmailBDD.confirmEmail = false
  const token = await veterinarioBDD.createToken()
  veterinarioBDD.token = token
  sendMailToUser(email, token)
  await veterinarioBDD.save()

  res.status(200).json({ msg: 'Email actualizado, revisa tu correo para activarlo' })
}

export {
  login,
  perfil,
  registro,
  confirmEmail,
  listarVeterinarios,
  detalleVeterinario,
  actualizarPerfil,
  actualizarPassword,
  recuperarPassword,
  comprobarTokenPasword,
  nuevoPassword,
  actualizarEmail
}
