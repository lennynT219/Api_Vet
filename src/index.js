import app from './server.js'

// Importar el metodo connect
import connect from './database.js'
// Llamar a la funcion connect
connect()

app.listen(app.get('port'), () => {
  console.log(`Server on http:// localhost:${app.get('port')}`)
})
