//Importar mongoose
import mongoose from 'mongoose';

//Establecer una regla
mongoose.set('strictQuery', false);  //strictQuery: Sirve que respete el numero de parametros que se le envian a la base de datos

//Creando una funcion
const connect = async () => {
  try {
    //Desestructuracion del metodo connect
    const { connection } = await mongoose.connect(process.env.MONGODB_URI)

    //Imprimir en consola
    console.log(`Database connected to: ${connection.host} - ${connection.port}`);
  } catch (err) {
    console.log(err)
  }
};

//Exportar la funcion
export default connect