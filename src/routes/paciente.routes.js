import {
  actualizarPaciente,
  detallePaciente,
  eliminarPaciente,
  listarPacientes,
  registrarPaciente,
  loginPaciente,
  perfilPaciente
} from '../controllers/paciente.controller.js'
import { Router } from 'express'
import { verifyToken } from '../middlewares/auth.js'

const pacienteRoutes = Router()

pacienteRoutes.post('/paciente/login', loginPaciente)
pacienteRoutes.get('/paciente/perfil', verifyToken, perfilPaciente)
pacienteRoutes.get('/pacientes', verifyToken, listarPacientes)
pacienteRoutes.get('/paciente/:id', verifyToken, detallePaciente)
pacienteRoutes.post('/paciente/registro', verifyToken, registrarPaciente)
pacienteRoutes.put('/paciente/actualizar/:id', verifyToken, actualizarPaciente)
pacienteRoutes.delete('/paciente/eliminar/:id', verifyToken, eliminarPaciente)

export default pacienteRoutes
