import mongoose from 'mongoose'
import { sendMailToPaciente } from '../config/nodemailes.js'
import Paciente from '../models/Pacientes.js'
import { createToken } from '../middlewares/auth.js'
import Tratamiento from '../models/Tratamiento.js'

const loginPaciente = async (req, res) => {
  // Actividad 1
  const { email, password } = req.body

  // Actividad 2
  if (Object.values(req.body).includes('')) return res.status(400).json({ msg: 'Faltan Datos' }) // Verifica si algun campo esta vacio

  const paciente = await Paciente.findOne({ email }) // Busca el paciente por email
  if (!paciente) return res.status(400).json({ msg: 'Email no registrado' }) // Verifica si el email esta registrado

  const verifyPassword = await paciente.matchPassword(password) // Verifica si la contraseña es correcta
  if (!verifyPassword) return res.status(400).json({ msg: 'Contraseña incorrecta' }) // Verifica si la contraseña es correcta

  // Actividad 3
  const token = createToken(paciente._id, 'paciente')
  const { nombre, propietario, email: emailP, celular, convencional, _id } = paciente

  // Actividad 4
  res.status(200).json({
    token,
    paciente: {
      nombre,
      propietario,
      email:
      emailP,
      celular,
      convencional,
      rol: 'paciente',
      _id
    }
  })
}
const perfilPaciente = (req, res) => {
  delete req.pacienteBDD.ingreso
  delete req.pacienteBDD.salida
  delete req.pacienteBDD.estado
  delete req.pacienteBDD.veterinario
  delete req.pacienteBDD.sintomas
  delete req.pacienteBDD.createdAt
  delete req.pacienteBDD.updatedAt
  delete req.pacienteBDD.__v
  console.log(req.pacienteBDD)
  res.status(200).json(req.pacienteBDD)
}

const listarPacientes = async (req, res) => {
  if (req.pacienteBDD && 'propietario' in req.pacienteBDD) {
    const pacientes = await Paciente.find(req.pacienteBDD._id).select('-password -createdAt -updatedAt -__v -salida').populate('veterinario', '_id nombre apellido')
    res.status(200).json(pacientes)
  } else { // Actividad 1 2 3
    const pacientes = await Paciente.find({ estado: true }).where('veterinario').equals(req.veterinarioBDD).select('-password -createdAt -updatedAt -__v -salida').populate('veterinario', '_id nombre apellido')
    // Actividad 4
    res.status(200).json(pacientes)
  }
}

const detallePaciente = async (req, res) => {
  // Actividad 1
  const { id } = req.params

  // Actividad 2
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, no existe el paciente con el id ${id}` }) // Verifica si el id es valido

  // Actividad 3
  const paciente = await Paciente.findById(id).select('-password -createdAt -updatedAt -__v').populate('veterinario', '_id nombre apellido') // Busca el paciente por id
  const tratamientos = await Tratamiento.find({ estado: true }).where('paciente').equals(id)
  paciente.tratamientos = tratamientos
  // Actividad 4
  res.status(200).json({ paciente })
}

const registrarPaciente = async (req, res) => {
  // Actividad 1
  const { email } = req.body

  // Actividad 2
  if (Object.values(req.body).includes('')) return res.status(400).json({ msg: 'Faltan Datos' }) // Verifica si algun campo esta vacio
  const verifyEmail = await Paciente.findOne({ email })
  if (verifyEmail) return res.status(400).json({ msg: 'Email ya registrado' }) // Verifica si el email esta registrado

  // Actividad 3
  const paciente = new Paciente(req.body)
  const password = Math.random().toString(36).slice(2)
  paciente.password = await paciente.encrypPassword('vet' + password)
  await sendMailToPaciente(email, 'vet' + password)
  paciente.veterinario = req.veterinarioBDD._id
  await paciente.save()

  // Actividad 4
  res.status(201).json({ msg: 'Paciente registrado', paciente })
}

const actualizarPaciente = async (req, res) => {
  // Actividad 1
  const { id } = req.params

  // Actividad 2
  if (Object.values(req.body).includes('')) return res.status(400).json({ msg: 'Faltan Datos' }) // Verifica si algun campo esta vacio
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, no existe el paciente con el id ${id}` }) // Verifica si el id es valido

  // Actividad 3
  await Paciente.findByIdAndUpdate(req.params.id, req.body)

  // Actividad 4
  res.status(200).json({ msg: 'Paciente actualizado' })
}

const eliminarPaciente = async (req, res) => {
  // Actividad 1
  const { id } = req.params
  const { salida } = req.body

  // Actividad 2
  if (Object.values(req.body).includes('')) return res.status(400).json({ msg: 'Faltan Datos' }) // Verifica si algun campo esta vacio
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `Lo sentimos, no existe el paciente con el id ${id}` }) // Verifica si el id es valido

  // Actividad 3
  await Paciente.findByIdAndUpdate(req.params.id, { salida: Date.parse(salida), estado: false })

  // Actividad 4
  res.status(200).json({ msg: 'Fecha de salida del paciente registrado exitosamente' })
}

export {
  loginPaciente,
  perfilPaciente,
  listarPacientes,
  detallePaciente,
  registrarPaciente,
  actualizarPaciente,
  eliminarPaciente
}
