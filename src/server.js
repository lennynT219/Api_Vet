// Importar modulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

// Importar rutas
import veterinarioRoutes from './routes/veterinario.routes.js'
import pacienteRoutes from './routes/paciente.routes.js'
import tratamientoRoutes from './routes/tratamieto.routes.js'

// Instacias
const app = express()
dotenv.config()
// Middlewares
app.use(express.json())

// Variable de entorno
app.set('port', process.env.PORT || 5000)

// Cors
app.use(cors())

// Rutas
app.get('/', (req, res) => {
  res.json({ message: 'Server on' })
})

// Rutas de veterinario
app.use('/api', veterinarioRoutes)
app.use('/api', pacienteRoutes)
app.use('/api', tratamientoRoutes)

// Ruta no encontrada
app.use((req, res) => res.status(404).send('Endpoint no encontrado - 404'))

export default app
