import { Router } from 'express'
import {
  detalleTratamiento,
  registrarTratamiento,
  actualizarTratamiento,
  eliminarTratamiento,
  cambiarEstado,
  listarTratamientos
} from '../controllers/tratamieto.controller.js'
import { validacionTratamiento } from '../middlewares/validacion_tratamieto.js'

const tratamientoRoutes = Router()
tratamientoRoutes.get('/tratamientos/:id_user', listarTratamientos)
tratamientoRoutes.post('/tratamiento/registro', validacionTratamiento, registrarTratamiento)
tratamientoRoutes
  .route('/tratamiento/:id')
  .get(detalleTratamiento)
  .put(actualizarTratamiento)
  .delete(eliminarTratamiento)

tratamientoRoutes.put('/tratamiento/estado/:id', cambiarEstado)

export default tratamientoRoutes
