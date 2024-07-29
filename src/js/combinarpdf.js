const { PDFDocument: PDFLibDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

// Combinar dos PDFs usando pdf-lib
async function combinePDFs(pdf1Path, pdf2Path, outputPath) {
  try {
    // Convertir rutas a absolutas
    const pdf1AbsolutePath = path.resolve(pdf1Path);
    const pdf2AbsolutePath = path.resolve(pdf2Path);

    console.log("Direcciones absolutas");
    console.log(pdf1AbsolutePath);
    console.log(pdf2AbsolutePath);

    // Verificar si los archivos existen
    if (!fs.existsSync(pdf1AbsolutePath)) {
      throw new Error(`El archivo ${pdf1AbsolutePath} no existe.`);
    }
    if (!fs.existsSync(pdf2Path)) {
      throw new Error(`El archivo ${pdf2AbsolutePath} no existe.`);
    }
    const pdf1Bytes = fs.readFileSync(pdf1AbsolutePath);
    const pdf2Bytes = fs.readFileSync(pdf2AbsolutePath);

    const pdf1Doc = await PDFLibDocument.load(pdf1Bytes);
    const pdf2Doc = await PDFLibDocument.load(pdf2Bytes);

    const pdf1Pages = pdf1Doc.getPages();
    const pdf2Pages = pdf2Doc.getPages();

    const mergedPdf = await PDFLibDocument.create();

    // Copiar páginas del primer PDF
    for (const page of pdf1Pages) {
      const [copiedPage] = await mergedPdf.copyPages(
        pdf1Doc,
        pdf1Doc.getPageIndices()
      );
      mergedPdf.addPage(copiedPage);
    }

    // Copiar páginas del segundo PDF
    for (const page of pdf2Pages) {
      const [copiedPage] = await mergedPdf.copyPages(
        pdf2Doc,
        pdf2Doc.getPageIndices()
      );
      mergedPdf.addPage(copiedPage);
    }
    const mergedPdfBytes = await mergedPdf.save();
    fs.writeFileSync(path.resolve(outputPath), mergedPdfBytes);

    console.log(`Los PDFs se han combinado correctamente en ${outputPath} `);
  } catch (error) {
    console.error("Error al combinar los PDFs:", error.message);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

async function mergePdfFiles(outputFileName, outputPath) {
  // Rutas de los archivos para la combinación de los mismos
  const pdf2Path = "./src/archivos_relevantes/temario.pdf"; //Habrá que sustituirlo por el archivo de temario correspondiente
  const pdf1Path = `${outputPath}`;
  const outPutResultPath = `${outputPath}`.replace(outputFileName, "");
  const outReturnPath =
    `${outPutResultPath}RESULTADO//${outputFileName}`.trim();

  console.log("pdf1Path", pdf1Path);
  console.log("pdf2Path", pdf2Path);
  console.log("--------------------IMPORTANTE-----------------");
  console.log("outPutResultPath", outPutResultPath);
  console.log("outReturnPath", outReturnPath);
  try {
    await combinePDFs(pdf1Path, pdf2Path, outReturnPath);
  } catch (error) {
    console.error("Error al generar y combinar el PDF:", error.message);
  }
}

// Exportar las funciones
module.exports = {
  combinePDFs,
  mergePdfFiles,
};
