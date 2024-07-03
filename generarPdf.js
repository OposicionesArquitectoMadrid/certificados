const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

const nodemailer = require('nodemailer');
require('dotenv').config();
const pathToCalibri = './Calibri Regular.ttf'
const pathToCalibriBold = './Calibri Bold.ttf'
const pathToCalibriItalic = './Calibri Italic.ttf'


// Función para implementar el retraso
function customDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async function generarPDF(students, selectedDirectory, dateInput, userInput, certType, pdfContent) {
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user:'academia.oposicionesarquitectos@gmail.com',
    //         pass: process.env.PASSWORD,
    //     },
    //     tls: {
    //         rejectUnauthorized: false,
    //     },
    //   });
   
    //   const transporter = nodemailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     port: 587,
    //     secure: false, // true para usar TLS, false para no usarlo
    //     auth: {
    //         user:'academia.oposicionesarquitectos@gmail.com',
    //         pass: process.env.PASSWORD,
    //     },
    // });
        

    const { es } = require('date-fns/locale');

  
    
    // Configurar en español para el formato de fecha
    const esLocale = es;

    // students.forEach(async (student, index) => {
        for (const [index, student] of students.entries()) {
          const doc = new PDFDocument({ size: 'A4' });
      


    const outputFileName = `${student.ALUMNO}_CERTIFICADO SP A AYTO 2024.pdf`
    const outputPath = path.join(selectedDirectory, outputFileName) // se guarda donde selecciona el usuario 
    


//formatear fecha
        const formattedDate = dateInput
   
    doc.pipe(fs.createWriteStream(outputPath))

   // todo lo q es contenido del pdf
   //pagina membretada (fondo) común para todos

   doc.image('./admin5.jpg', 0, 0, { width: 595, height: 842 }); // Tamaño A4: 595 x 842 puntos


   if (certType === 'inscripción') {
    // Certificado de inscripción
    doc.font(pathToCalibri).fillColor('black').fontSize(10).lineGap(11);
  
    // Parte 1 del texto con el nombre del alumno en negrita
    doc.font(pathToCalibri).text(`Que Don/Doña `, 90, 290, { continued: true }); 
    doc.font(pathToCalibriBold).text(`${student.ALUMNO}`, { continued: true });
    doc.font(pathToCalibri).text(` con DNI: ${student.DNI}, se encuentra inscrito/a en el curso ${student.CURSO}, dirigido a ${student.DIRIGIDO_A}, organizado por la academia `, { continued: true });
    
    // "Oposiciones Arquitectos" en negrita
    doc.font(pathToCalibriBold).text('Oposiciones Arquitectos', { continued: true });
  
    // Parte 2 del texto
    doc.font(pathToCalibri).text(`, este curso se imparte desde el ${student.FECHA_INICIO}, los días ${student.DIA} de ${student.HORA_INICIO} a ${student.HORA_FIN} h, y hasta el día de emisión del presente certificado, se ha impartido un total de ${userInput} horas de clases Streaming.



Y para que conste, firma en Madrid a ${formattedDate}`, { width: 400, align: 'left' });
// Finalizar el PDF
doc.end();
}

if (certType === 'inscripción-hacienda') {
  // Certificado de inscripción
  doc.font(pathToCalibri).fillColor('black').fontSize(10).lineGap(11);

  // Parte 1 del texto con el nombre del alumno en negrita
  doc.font(pathToCalibri).text(`Que Don/Doña `, 90, 290, { continued: true }); 
  doc.font(pathToCalibriBold).text(`${student.ALUMNO}`, { continued: true });
  doc.font(pathToCalibri).text(` con DNI: ${student.DNI}, se encuentra inscrito/a en el curso ${student.CURSO}, dirigido a ${student.DIRIGIDO_A}, organizado por la academia `, { continued: true });
  
  // "Oposiciones Arquitectos" en negrita
  doc.font(pathToCalibriBold).text('Oposiciones Arquitectos', { continued: true });

  // Parte 2 del texto
  doc.font(pathToCalibri).text(`, este curso se imparte desde el ${student.FECHA_INICIO}, los días ${student.DIA} de ${student.HORA_INICIO} a ${student.HORA_FIN} h, y hasta el día de emisión del presente certificado, se ha impartido un total de ${userInput} horas de clases Streaming.



Y para que conste, firma en Madrid a ${formattedDate}`, { width: 400, align: 'left' });
// Finalizar el PDF
doc.end();
}


else if (certType === 'realizado') {
  // Certificado de curso realizado
  doc.font(pathToCalibri).fillColor('black').fontSize(10).lineGap(11);

  // Parte 1 del texto con el nombre del alumno en negrita
  doc.font(pathToCalibri).text(`Que Don/Doña `, 90, 290, { continued: true }); 
  doc.font(pathToCalibriBold).text(`${student.ALUMNO}`, { continued: true });
  doc.font(pathToCalibri).text(` con DNI: ${student.DNI}, ha participado como alumno/a en el curso ${student.CURSO}, dirigido a ${student.DIRIGIDO_A}, organizado por la academia `, { continued: true });
  
  // "Oposiciones Arquitectos" en negrita
  doc.font(pathToCalibriBold).text('Oposiciones Arquitectos ', { continued: true });

  // Parte 2 del texto
  doc.font(pathToCalibri).text(`e impartido desde el ${student.FECHA_INICIO} hasta el ${student.FECHA_FIN} con una duración total de ${userInput} horas lectivas.
  
Durante el curso se han impartido los temarios publicados en las correspondientes convocatorias.
Se adjunta el desglose de los temas impartidos.

Y para que conste, firma en Madrid a ${formattedDate}`, { width: 400, align: 'left'});
 

// Finalizar el PDF
doc.end();

}


else if (certType === 'supuestos-prácticos') {
  // Certificado de curso realizado SUPUESTOS PRÁCTICOS
  doc.font(pathToCalibri).fillColor('black').fontSize(10).lineGap(11);

  // Parte 1 del texto con el nombre del alumno en negrita
  doc.font(pathToCalibri).text(`Que Don/Doña `, 90, 290, { continued: true }); 
  doc.font(pathToCalibriBold).text(`${student.ALUMNO}`, { continued: true });
  doc.font(pathToCalibri).text(` con DNI: ${student.DNI}, ha participado como alumno/a en el curso ${student.CURSO}, dirigido a ${student.DIRIGIDO_A}, organizado por la academia  `, { continued: true });
  
  // "Oposiciones Arquitectos" en negrita
  doc.font(pathToCalibriBold).text('Oposiciones Arquitectos ', { continued: true });

  // Parte 2 del texto
  doc.font(pathToCalibri).text(`e impartido desde el ${student.FECHA_INICIO} hasta el ${student.FECHA_FIN} con una duración total de ${userInput} horas lectivas.


Y para que conste, firma en Madrid a ${formattedDate}`, { width: 400, align: 'left'});
// Finalizar el PDF
doc.end();
}

else if (certType === 'teoría-práctico-CM') {
  // Certificado de curso TEORICO PRÁCTICO CM
  doc.font(pathToCalibri).fillColor('black').fontSize(10).lineGap(11);

  // Parte 1 del texto con el nombre del alumno en negrita
  doc.font(pathToCalibri).text(`Que Don/Doña `, 90, 290, { continued: true }); 
  doc.font(pathToCalibriBold).text(`${student.ALUMNO}`, { continued: true });
  doc.font(pathToCalibri).text(` con DNI: ${student.DNI}, ha participado como alumno/a en el curso de preparación teórico y práctico, para las oposiciones de la Comunidad de Madrid, dirigido a ${student.DIRIGIDO_A}, organizado por la academia `, { continued: true });
  
  // "Oposiciones Arquitectos" en negrita
  doc.font(pathToCalibriBold).text('Oposiciones Arquitectos ', { continued: true });

  // Parte 2 del texto
  doc.font(pathToCalibri).text(`e impartido desde el ${student.FECHA_INICIO} hasta el ${student.FECHA_FIN} con una duración total de ${userInput} horas lectivas.
  
Durante el curso se han impartido los temarios publicados en las correspondientes convocatorias.
Se adjunta el desglose de los temas impartidos.

Y para que conste, firma en Madrid a ${formattedDate}`, { width: 400, align: 'left'});
 

// Finalizar el PDF
doc.end();
}

else if (certType === 'teoría-práctico-AYTO') {
   // Certificado de curso TEORICO PRÁCTICO AYTO
   doc.font(pathToCalibri).fillColor('black').fontSize(10).lineGap(11);

   // Parte 1 del texto con el nombre del alumno en negrita
   doc.font(pathToCalibri).text(`Que Don/Doña `, 90, 290, { continued: true }); 
   doc.font(pathToCalibriBold).text(`${student.ALUMNO}`, { continued: true });
   doc.font(pathToCalibri).text(` con DNI: ${student.DNI}, ha participado como alumno/a en el curso de preparación teórico y práctico, para las oposiciones del Ayuntamiento de Madrid, dirigido a ${student.DIRIGIDO_A}, organizado por la academia `, { continued: true });
   
   // "Oposiciones Arquitectos" en negrita
   doc.font(pathToCalibriBold).text('Oposiciones Arquitectos ', { continued: true });
 
   // Parte 2 del texto
   doc.font(pathToCalibri).text(`e impartido desde el ${student.FECHA_INICIO} hasta el ${student.FECHA_FIN} con una duración total de ${userInput} horas lectivas.
   
 Durante el curso se han impartido los temarios publicados en las correspondientes convocatorias.
 Se adjunta el desglose de los temas impartidos.
 
 Y para que conste, firma en Madrid a ${formattedDate}`, { width: 400, align: 'left'});
  
 
 // Finalizar el PDF
 doc.end();
}

else if (certType === 'hacienda-realizado') {
  // Certificado de curso realizado HACIENDA
  doc.font(pathToCalibri).fillColor('black').fontSize(10).lineGap(11);

  // Parte 1 del texto con el nombre del alumno en negrita
  doc.font(pathToCalibri).text(`Que Don/Doña `, 90, 290, { continued: true }); 
  doc.font(pathToCalibriBold).text(`${student.ALUMNO}`, { continued: true });
  doc.font(pathToCalibri).text(` con DNI: ${student.DNI}, ha participado como alumno/a en el curso ${student.CURSO}, dirigido a ${student.DIRIGIDO_A}, organizado por la academia  `, { continued: true });
  
  // "Oposiciones Arquitectos" en negrita
  doc.font(pathToCalibriBold).text('Oposiciones Arquitectos ', { continued: true });

  // Parte 2 del texto
  doc.font(pathToCalibri).text(`e impartido desde el ${student.FECHA_INICIO} hasta el ${student.FECHA_FIN} con una duración total de ${userInput} horas lectivas.


Y para que conste, firma en Madrid a ${formattedDate}`, { width: 400, align: 'left'});
// Finalizar el PDF
doc.end();
}

// // Enviar correo 
//   const invoice = `${student.ALUMNO}_certificado.pdf`;
//     const recipient = student.EMAIL;
//     const subject = 'Certificado';
//     const body = `Estimado/a ${student.ALUMNO}, adjunto encontrarás tu certificado. Un cordial saludo.
    
    
//     * Por favor, no responda a este mensaje, ha sido enviado de forma automática. Si desea ponerse en contacto con nosotros para comentarnos alguna incidencia o mejora de este servicio, por favor, escríbanos a info@oposicionesarquitectos.com

// Oposiciones Arquitectos
// C/. Orense 10 2º Oficina 10, 28020 - Madrid
// www.oposicionesarquitectos.com



// ---- ADVERTENCIA ---- La información contenida en este correo electrónico, y en su caso, cualquier fichero anexo al mismo, son de carácter privado y confidencial siendo para uso exclusivo de su destinatario. Si usted no es el destinatario correcto, el empleado o agente responsable de entregar el mensaje al destinatario, o ha recibido esta comunicación por error, le informamos que está totalmente prohibida cualquier divulgación, distribución o reproducción de esta comunicación según la legislación vigente y le rogamos que nos lo notifique inmediatamente, procediendo a su destrucción sin continuar su lectura.

// Le informamos que, en cumplimiento del Reglamento (UE) 2016/679, su dirección de correo electrónico, así como el resto de los datos de carácter personal de la tarjeta de visita que nos facilite, podrían ser objeto de tratamiento automatizado en nuestros sistemas de información, con la finalidad de gestionar la agenda de contactos de OPOSICIONES ARQUITECTOS, S.L. Usted podrá en cualquier momento ejercer sus derechos de acceso, rectificación, cancelación, oposición, limitación y portabilidad de datos en los términos establecidos en el Reglamento (UE) 2016/679 de Protección de Datos mediante notificación escrita, aportando copia del DNI o tarjeta identificativa, a nuestro correo oposicionesarquitectosmadrid@gmail.com.

// Usted puede consultar nuestra política de Protección de Datos en www.oposicionesarquitectos.com`
    
//       ;

//       const mailOptions = {
//         from: 'Oposiciones Arquitectos <academia.oposicionesarquitectos@gmail.com>',
//         to: recipient,
//         subject: subject,
//         text: body,
//         attachments: [
//           {
//             filename: invoice,
//             path: path.join(selectedDirectory, invoice),
//           },
//         ],
//       };
      
      // Si hay contenido adicional, agregarlo como adjunto (es el pdf opcional que agrega el usuario, temario...que se adjunta en algunos certificados)
    //   if (pdfContent) {
    //     mailOptions.attachments.push({
    //       filename: 'temario.pdf',
    //       content: Buffer.from(pdfContent.split(',')[1], 'base64'),
    //     });
    //   }
      

    // try {
    //   await transporter.sendMail(mailOptions);
    //   console.log(`Correo para el alumno: ${student.ALUMNO} enviado a ${student.EMAIL}`);


    //   // Retraso de 15 segundos antes de enviar el siguiente correo
    //   if (index < students.length - 1) {
    //     await customDelay(15000);
    //   }
    // } catch (error) {
    //   console.error(`Error al enviar correo a ${student.ALUMNO}a la dirección ${student.EMAIL} no se ha enviado el certificado`, error);
    // }
  

  const message = `Certificado guardado para el alumno: ${student.ALUMNO}`;
  console.log(message);

  if (index === students.length - 1) {
    console.log('CERTIFICADOS GENERADOS Y GUARDADOS PARA TODOS LOS ALMUNOS/AS');
  }

}
}

module.exports = generarPDF;