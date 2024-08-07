import jwt from 'jsonwebtoken'
import Veterinario from '../models/Veterinario.js'
import Paciente from '../models/Pacientes.js'

const createToken = (id, rol) => {
  return jwt.sign({ id, rol }, 'secret_key', { expiresIn: '1h' }) // Poner el seceret_key en un archivo .env
}

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Token no proporcionado.' })

  const { authorization } = req.headers

  try {
    const { id, rol } = jwt.verify(authorization.split(' ')[1], 'secret_key')
    if (rol === 'veterinario') {
      req.veterinarioBDD = await Veterinario.findById(id).lean().select('-password')
      next()
    } else {
      req.pacienteBDD = await Paciente.findById(id).lean().select('-password')
      next()
    }
  } catch (err) {
    const e = new Error('Token no válido')
    return res.status(401).json({ message: e.message })
  }
}

export {
  createToken,
  verifyToken
}
