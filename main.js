const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const url = require('url')
const generarPDF = require('./generarPdf')
const { format } = require('date-fns')
const nodemailer = require('nodemailer');

let mainWindow
let students = []

let selectedDirectoryForEmails = null; // Variable para almacenar el directorio seleccionado para los correos
let dateInputGlobal = ''; // Variable global para almacenar la fecha
let userInputGlobal = ''; // Variable global para almacenar userInput

let pdfContentGlobal = '';  // Nueva variable global para almacenar pdfContent

function createWindow() {


const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;

mainWindow = new BrowserWindow({
  width: width,
  height: height,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: path.join(__dirname, 'preload.js')
  },
   autoHideMenuBar: true,
  fullscreen: false, // Agrega esta línea para activar el modo de pantalla completa
})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', () => {
    mainWindow = null;
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// para recibir el contenido JSON y el número de factura
ipcMain.on('load-data', (event, data) => {
  const { jsonContent, dateInput, userInput, pdfContent} = data;

  try {
    students = JSON.parse(jsonContent)
  
    pdfContentGlobal = pdfContent;  // Guarda pdfContent en la variable global


    console.log('Fecha:', dateInput); // Muestra la fecha en la consola
    console.log('Horas lectivas:', userInput)

    console.log('Datos del JSON:', students) //muestra los datos en la consola
  } catch (error) {
    console.error('Error al procesar el JSON:', error)
  }
})


// para recibir la fecha desde el proceso de renderizado
ipcMain.on('set-date-input-global', (event, dateInput) => {
  dateInputGlobal = dateInput;
 
});

// para recibir el userInput desde el proceso de renderizado
ipcMain.on('set-user-input-global', (event, userInput) => {
  userInputGlobal = userInput;
  console.log('Horas lectivas:', userInput);
});

// mostrar el diálogo de selección de directorio al recibir el evento 'select-directory'
ipcMain.on('select-directory', (event, certType) => {
  dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Seleccione un directorio para guardar los PDFs',
  }).then(result => {
    if (!result.canceled && result.filePaths.length > 0) {
      const selectedDirectory = result.filePaths[0]
      if (students.length > 0) {
        console.log('Horas lectivas:', userInputGlobal);
        generarPDF(students, selectedDirectory, dateInputGlobal, userInputGlobal, certType, pdfContentGlobal) // Llamamos a la función para generar los PDFs
      } else {
        console.error('Error: No se pueden generar los PDFs. Asegúrate de cargar los datos primero.')
      }
    }
  }).catch(err => {
    console.error('Error al mostrar el diálogo de selección de directorio:', err)
  })
})