import { Router } from 'express'
import {
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
} from '../controllers/veterinario_controller.js'
import { verifyToken } from '../middlewares/auth.js'

const veterinarioRoutes = Router()

veterinarioRoutes.post('/login', login)

veterinarioRoutes.post('/registro', registro)

veterinarioRoutes.get('/confirmar/:token', confirmEmail)

veterinarioRoutes.get('/veterinarios', listarVeterinarios)

veterinarioRoutes.post('/recuperar-password', recuperarPassword)

veterinarioRoutes.put('/actualizar-email', verifyToken, actualizarEmail)

veterinarioRoutes.get('/recuperar-password/:token', comprobarTokenPasword)

veterinarioRoutes.post('/nuevo-password/:token', nuevoPassword)

veterinarioRoutes.get('/perfil', verifyToken, perfil)

veterinarioRoutes.put('/veterinario/actualizarpassword', verifyToken, actualizarPassword)

veterinarioRoutes.get('/veterinario/:id', detalleVeterinario)

veterinarioRoutes.put('/veterinario/:id', verifyToken, actualizarPerfil)

export default veterinarioRoutes
