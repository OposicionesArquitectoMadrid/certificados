const { mergePdfFiles } = require("./combinarpdf");
const PDFDocument = require("pdfkit");

const fs = require("fs");
const path = require("path");
const { format } = require("date-fns");

const nodemailer = require("nodemailer");
require("dotenv").config();
const pathToCalibri = "./Calibri Regular.ttf";
const pathToCalibriBold = "./Calibri Bold.ttf";
const pathToCalibriItalic = "./Calibri Italic.ttf";

// Función para implementar el retraso
function customDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generarPDF(
  students,
  selectedDirectory,
  dateInput,
  userInput,
  certType,
  pdfContent
) {
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

  const { es } = require("date-fns/locale");

  // Configurar en español para el formato de fecha
  const esLocale = es;

  // students.forEach(async (student, index) => {
  for (const [index, student] of students.entries()) {
    const doc = new PDFDocument({ size: "A4" });
    const studentName = student.ALUMNO.replaceAll(" ", "_");

    const outputFileName = `${studentName}_CERTIFICADO_SP_AT_AYTO_2020_2021.pdf`; //TODO: CAMBIAR NOMBRE PARA EL ARCHIVO
    const outputPath = path.join(selectedDirectory, outputFileName); // se guarda donde selecciona el usuario

    //formatear fecha
    const formattedDate = dateInput;

    doc.pipe(fs.createWriteStream(outputPath));

    //Parte 1 del texto
    let text1 = "";
    let text2 = ` e impartido desde el ${student.FECHA_INICIO} hasta el ${student.FECHA_FIN} con una duración total de ${userInput} horas lectivas.
  
 Durante el curso se han impartido los temarios publicados en las correspondientes convocatorias.
 Se adjunta el desglose de los temas impartidos.

 Y para que conste, firma en Madrid a ${formattedDate}`;
    if (certType === "inscripción" && certType === "inscripción-hacienda") {
      text1 = ` con DNI: ${student.DNI}, se encuentra inscrito/a en el curso ${student.CURSO}, dirigido a ${student.DIRIGIDO_A}, organizado por la academia `;
      text2 = `, este curso se imparte desde el ${student.FECHA_INICIO}, los días ${student.DIA} de ${student.HORA_INICIO} a ${student.HORA_FIN} h, y hasta el día de emisión del presente certificado, se ha impartido un total de ${userInput} horas de clases Streaming.


											   

Y para que conste, firma en Madrid a ${formattedDate}`;
    } else if (certType === "realizado") {
      text1 = ` con DNI: ${student.DNI}, ha participado como alumno/a en el curso ${student.CURSO}, dirigido a ${student.DIRIGIDO_A}, organizado por la academia `;
    } else if (certType === "supuestos-prácticos") {
      text1 = ` con DNI: ${student.DNI}, ha participado como alumno/a en el curso ${student.CURSO}, dirigido a ${student.DIRIGIDO_A}, organizado por la academia  `;
      text2 = ` e impartido desde el ${student.FECHA_INICIO} hasta el ${student.FECHA_FIN} con una duración total de ${userInput} horas lectivas.



Y para que conste, firma en Madrid a ${formattedDate}`;
    } else if (certType === "teoría-práctico-CM") {
      text1 = ` con DNI: ${student.DNI}, ha participado como alumno/a en el curso de preparación teórico y práctico, para las oposiciones de la Comunidad de Madrid, dirigido a ${student.DIRIGIDO_A}, organizado por la academia `;
    } else if (certType === "teoría-práctico-AYTO") {
      //text1 = ` con DNI: ${student.DNI}, ha participado como alumno/a en el curso de preparación teórico y práctico, para las oposiciones del Ayuntamiento de Madrid, dirigido a ${student.DIRIGIDO_A}, organizado por la academia `;
      text1 = ` con DNI: ${student.DNI}, ha participado como alumno/a en el curso de preparación teórico, para las oposiciones del Ayuntamiento de Madrid, dirigido a ${student.DIRIGIDO_A}, organizado por la academia `;
    } else if (certType === "hacienda-realizado") {
      text1 = ` con DNI: ${student.DNI}, ha participado como alumno/a en el curso de preparación teórico y práctico, para las oposiciones del Ayuntamiento de Madrid, dirigido a ${student.DIRIGIDO_A}, organizado por la academia `;
    }

    // todo lo q es contenido del pdf
    //pagina membretada (fondo) común para todos

    doc.image("./riveteFirma20240730.jpg", 0, 0, { width: 595, height: 842 }); // Tamaño A4: 595 x 842 puntos
    //Modificado 23/07/2024 ./admin5.jpg por admin.jpg

    // Certificado de inscripción
    doc.font(pathToCalibri).fillColor("black").fontSize(10).lineGap(11);

    // Parte 1 del texto con el nombre del alumno en negrita
    doc.font(pathToCalibri).text(`Que Don/Doña `, 90, 290, { continued: true });
    doc.font(pathToCalibriBold).text(`${student.ALUMNO}`, { continued: true });
    doc.font(pathToCalibri).text(text1, { continued: true });

    // "Oposiciones Arquitectos" en negrita
    doc
      .font(pathToCalibriBold)
      .text("Oposiciones Arquitectos", { continued: true });

    // Parte 2 del texto
    doc.font(pathToCalibri).text(text2, { width: 400, align: "left" });
    // Finalizar el PDF
    doc.end();
    try {
      await customDelay(50);
      await mergePdfFiles(outputFileName, outputPath);
    } catch (error) {
      console.error("Error al generar y combinar el PDF:", error.message);
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
    // if (pdfContent) {
    //   mailOptions.attachments.push({
    //     filename: "temario.pdf",
    //     content: Buffer.from(pdfContent.split(",")[1], "base64"),
    //   });
    // }

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
      console.log(
        "CERTIFICADOS GENERADOS Y GUARDADOS PARA TODOS LOS ALMUNOS/AS"
      );
    }
  }
}

module.exports = generarPDF;
