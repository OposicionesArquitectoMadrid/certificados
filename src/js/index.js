let dateInputGlobal = "";
let userInputGlobal = "";

function loadData() {
  const fileInput = document.getElementById("jsonFileInput");
  const pdfInput = document.getElementById("userPdfInput");
  const file = fileInput.files[0];
  const pdfFile = pdfInput.files[0];

  const dateInput = document.getElementById("dateInput").valueAsDate;
  const userInput = document.getElementById("userInput").value;

  const formattedDate = dateInput.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const reader = new FileReader();

  // Verifica si se ha seleccionado un archivo PDF adicional
  if (pdfFile) {
    const pdfReader = new FileReader();
    pdfReader.onload = function (event) {
      const pdfContent = event.target.result;
      console.log("Contenido del PDF adicional cargado");

      reader.onload = function (event) {
        const jsonContent = event.target.result;
        console.log("Contenido del JSON:", jsonContent);

        const data = {
          jsonContent: jsonContent,
          userInput: userInput,
          dateInput: formattedDate,
          pdfContent: pdfContent,
        };

        dateInputGlobal = formattedDate;
        userInputGlobal = userInput;

        window.ipcRenderer.send("set-date-input-global", dateInputGlobal);
        window.ipcRenderer.send("set-user-input-global", userInputGlobal);

        window.ipcRenderer.send("load-data", data);

        const consoleElement = document.getElementById("console");
        const message = `Fecha: ${formattedDate}\nHoras Lectivas: ${userInput}\nDatos del JSON: ${jsonContent}\nContenido del PDF cargado (TEMARIO)`;

        consoleElement.innerText = message;
      };

      // Inicia la lectura del archivo JSON
      reader.readAsText(file);
    };

    // Inicia la lectura del PDF del usuario
    pdfReader.readAsDataURL(pdfFile);
  } else {
    // Si no se selecciona un archivo PDF, solo lee el contenido del archivo JSON
    reader.onload = function (event) {
      const jsonContent = event.target.result;
      console.log("Contenido del JSON:", jsonContent);

      const data = {
        jsonContent: jsonContent,
        userInput: userInput,
        dateInput: formattedDate,
        pdfContent: "",
      };

      dateInputGlobal = formattedDate;
      userInputGlobal = userInput;

      window.ipcRenderer.send("set-date-input-global", dateInputGlobal);
      window.ipcRenderer.send("set-user-input-global", userInputGlobal);

      window.ipcRenderer.send("load-data", data);

      const consoleElement = document.getElementById("console");
      const message = `Fecha: ${formattedDate}\nHoras Lectivas: ${userInput}\nDatos del JSON: ${jsonContent}\nNo se cargó un PDF ADICIONAL`;

      consoleElement.innerText = message;
    };

    reader.readAsText(file);
  }
}

function selectDirectoryAndGeneratePDFs(certType) {
  window.ipcRenderer.send("select-directory", certType);
}
// función para limpiar datos en el lado del renderizado
function clearData() {
  // limpia datos
  dateInputGlobal = "";
  userInputGlobal = "";
  students = [];
  pdfContentGlobal = "";

  // Limpia la consola
  const consoleElement = document.getElementById("console");
  consoleElement.innerText = "Datos limpiados.";

  // Restablece los valores de los elementos de entrada de archivo
  const fileInput = document.getElementById("jsonFileInput");
  const pdfInput = document.getElementById("userPdfInput");
  fileInput.value = ""; // Limpiar el valor del input de JSON
  pdfInput.value = ""; // Limpiar el valor del input de PDF adicional

  // También envía una señal al proceso principal (main.js) para limpiar datos
  window.ipcRenderer.send("clear-data");
}
