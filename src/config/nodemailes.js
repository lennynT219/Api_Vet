import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({ // Configurar el transporte
  service: 'gmail',
  host: process.env.HOST_MAILTRAP,
  port: process.env.PORT_MAILTRAP,
  auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP
  }
})

const sendMailToUser = (userMail, token) => {
  const mailOptions = {
    from: process.env.USER_MAILTRAP, // Quien envia el correo
    to: userMail, // Quien recibe el correo
    subject: 'Verifica tu cuenta', // Asunto del correo
    html: `
    <p>Hola, haz clic 
      <a href='${process.env.URL_FRONTED}/confirmar/${encodeURIComponent(token)}'>
        aquí
      </a> para confirmar tu cuenta.
    </p>
    ` // Cuerpo del correo
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log('Correo enviado: ' + info.response)
    }
  })
}

// Recuperar cuenta
const sendMailToRecoveryPassord = async (userMail, token) => {
  const info = await transporter.sendMail({
    from: 'admin@vet.com',
    to: userMail,
    subject: 'Correo para reestablecer tu contraseña',
    html: `
  <h1>Sistema de gestión (VET-ESFOT 🐶 😺)</h1>
  <hr>
  <a href=${process.env.URL_FRONTED}/recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
  <hr>
  <footer>Grandote te da la Bienvenida!</footer>
  `
  })
  console.log('Mensaje enviado satisfactoriamente: ', info.messageId)
}

// Enviar correo al paciente

const sendMailToPaciente = async (userMail, password) => {
  const info = await transporter.sendMail({
    from: 'admin@vet.com',
    to: userMail,
    subject: 'Correo de bienvenida',
    html: `
  <h1>Sistema de gestión (VET-ESFOT 🐶 😺)</h1>
  <hr>
  <p>Contraseña de acceso: ${password}</p>
  <a href=${process.env.URL_FRONTED}/paciente/login>Clic para iniciar sesión</a>
  <hr>
  <footer>Grandote te da la Bienvenida!</footer>
  `
  })
  console.log('Mensaje enviado satisfactoriamente: ', info.messageId)
}

export {
  sendMailToUser,
  sendMailToRecoveryPassord,
  sendMailToPaciente
}
