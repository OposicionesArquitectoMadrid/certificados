const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')
const { format } = require('date-fns')
const pathToCalibri = './Calibri Regular.ttf'
const pathToCalibriBold = './Calibri Bold.ttf'
const pathToCalibriItalic = './Calibri Italic.ttf'
const nodemailer = require('nodemailer')
require('dotenv').config()

// Función para implementar el retraso
function customDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function generarPDF(students, selectedDirectory, dateInput) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:'factura.oposicionesarquitectos@gmail.com',
            pass: process.env.PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
      });
      

    const { es } = require('date-fns/locale');

  
    
    // Configurar en español para el formato de fecha
    const esLocale = es;

    // students.forEach(async (student, index) => {
        for (const [index, student] of students.entries()) {
          const doc = new PDFDocument({ size: 'letter' });
   
    const outputFileName = `${student.ALUMNO}_certificado.pdf`
    const outputPath = path.join(selectedDirectory, outputFileName) // se guarda donde selecciona el usuario 
    
//formatear fecha
        const formattedDate = dateInput
   
    
    doc.pipe(fs.createWriteStream(outputPath))

   // todo lo q es contenido del pdf
   //pagina membretada (fondo)

   doc.image('./Diseño fondo.jpg', 0, 0, { width: 612, height: 792 });
   
// Agregar los textos con posiciones fijas
doc.font(pathToCalibri).fillColor('black').fontSize(10).lineGap(11).text(`Que Don/Doña ${student.ALUMNO} con DNI ${student.DNI}, se encuentra inscrito/a en el curso ${student.CURSO}, dirigido a ... , organizado por la academia de Oposiciones Arquitectos, este curso se imparte desde FECHA..., ACÁ VAN DÍAS Y HORARIOS....., y hasta el día de emisión del presente certificado, se ha impartido un total de TOTAL DE HORAS de clases Streaming.


Y para que conste, firma en Madrid a ${formattedDate}`, 110, 260, {width: 400});


// Finalizar el PDF
doc.end();


// Enviar correo si ENVIAR es "SI"

    const invoice = `${student.ALUMNO}_certificado.pdf`;
    const recipient = student.EMAIL;
    const subject = 'Certificado';
    const body = `Estimado/a ${student.ALUMNO}, adjunto encontrarás tu certificado. Un cordial saludo`
    
      ;


    
    const mailOptions = {
      from: 'Facturacion Oposiciones Arquitectos <facturacion@oposicionesarquitectos.com>',
      to: recipient,
      subject: subject,
      text: body,
      attachments: [
        {
          filename: invoice,
          path: path.join(selectedDirectory, invoice),
        },
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Correo para el alumno: ${student.ALUMNO} enviado a ${student.EMAIL}`);


      // Retraso de 15 segundos antes de enviar el siguiente correo
      if (index < students.length - 1) {
        await customDelay(15000);
      }
    } catch (error) {
      console.error(`Error al enviar correo a ${student.ALUMNO}a la dirección ${student.EMAIL} no se ha enviado el certificado`, error);
    }
  

  const message = `Certificado guardado para el alumno: ${student.ALUMNO}`;
  console.log(message);


  if (index === students.length - 1) {
    console.log('CERTIFICADOS GENERADOS Y GUARDADOS PARA TODOS LOS ALMUNOS/AS');
  }
}
}

module.exports = generarPDF;