import Tratamiento from '../models/Tratamiento.js'
import mongoose from 'mongoose'

const detalleTratamiento = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: 'Lo sentimos, no existe ese tratamiento' })
  const tratamiento = await Tratamiento.findById(id).populate('paciente', '_id nombre')
  res.status(200).json(tratamiento)
}

const listarTratamientos = async (req, res) => {
  const { id_user } = req.params
  const tratamientos = await Tratamiento.find({ paciente: id_user }).select('-createdAt -updatedAt -__v').populate('paciente', '_id nombre')
  res.status(200).json(tratamientos)
}

const registrarTratamiento = async (req, res) => {
  // Acctividad 1
  const { paciente } = req.body

  // Actividad 2
  if (!mongoose.Types.ObjectId.isValid(paciente)) return res.status(404).json({ msg: 'Lo sentimos, debe ser un id válido' })

  // Actividad 3
  const tratamiento = await Tratamiento.create(req.body)

  // Actividad 4
  res.status(201).json({ msg: 'Tratamiento registrado', tratamiento })
}

const actualizarTratamiento = async (req, res) => {
  // Actividad 1
  const { id } = req.params

  // Actividad 2
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: 'Lo sentimos, debe ser un id válido' })

  // Actividad 3
  const tratamiento = await Tratamiento.findByIdAndUpdate(id, req.body)

  // Actividad 4
  res.status(200).json({ msg: 'Tratamiento actualizado', tratamiento })
}

const eliminarTratamiento = async (req, res) => {
  // Actividad 1
  const { id } = req.params

  // Actividad 2
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: 'Lo sentimos, debe ser un id válido' })

  // Actividad 3
  await Tratamiento.findByIdAndDelete(id)

  // Actividad 4
  res.status(200).json({ msg: 'Tratamiento eliminado' })
}
const cambiarEstado = async (req, res) => {
  // Actividad 1
  const { id } = req.params

  // Actividad 2
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: 'Lo sentimos, debe ser un id válido' })

  // Actividad 3
  await Tratamiento.findByIdAndUpdate(id, { estado: false })

  // Actividad 4
  res.status(200).json({ msg: 'Estado del tratamiento actualizado' })
}

export {
  detalleTratamiento,
  registrarTratamiento,
  actualizarTratamiento,
  eliminarTratamiento,
  cambiarEstado,
  listarTratamientos
}
