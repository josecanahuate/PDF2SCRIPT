// Function to show the uploaded PDF icon
function readURL(input) {
  if (input.files && input.files[0]) {
    var fileExtension = input.files[0].name.split('.').pop().toLowerCase();

    if (fileExtension === 'pdf') {
      $('.image-upload-wrap').hide();
      $('.file-upload-image').attr('src', 'assets/imgs/pdf.png');
      $('.file-upload-content').show();
      $('.image-title').html(input.files[0].name);
    } else {
      //  if the file is not PDF, display an alert
      alert('Please select a PDF file.');
      removeUpload();
    }
  } else {
    removeUpload();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Set the worker source for PDF.js library
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

  let pdfinput = document.querySelector(".selectpdf");
  let upload = document.querySelector(".upload");
  let pdftext = document.querySelector(".pdftext");
  let download = document.querySelector(".download");

  upload.addEventListener('click', () => {
    let file = pdfinput.files[0];
    if (file && file.type === "application/pdf") {
      let fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onload = async () => {
        let res = fr.result;
        try {
          let pdf = await pdfjsLib.getDocument(res).promise;
          let pages = pdf.numPages;
          let extractedText = '';

          for (let i = 1; i <= pages; i++) {
            let page = await pdf.getPage(i);
            let txt = await page.getTextContent();
            let text = txt.items.map((s) => s.str).join("");
            extractedText += text + '\n\n';
          }
          pdftext.value = extractedText;

          // Enable download link if text is available
          download.style.display = extractedText ? "inline-block" : "none";
        } catch (err) {
          alert(err.message);
        }
      }
    } else {
      alert("Select a valid PDF file");
    }
  });


  download.addEventListener("click", (event) => {
    event.preventDefault(); // Detener el comportamiento predeterminado del enlace
    let text = pdftext.value;

    if (text) {
      let blob = new Blob([text], { type: "text/plain" });
      let url = URL.createObjectURL(blob);

      // Obtener el nombre del archivo del elemento .image-title
      let filename = document.querySelector('.image-title').textContent.trim();

      let a = document.createElement("a");
      a.href = url;
      a.download = filename + ".txt"; // Establecer el nombre de descarga con el nombre del PDF subido
      a.click();

      URL.revokeObjectURL(url);
      a.remove();

      // Limpiar el texto extraído y ocultar el enlace de descarga
      pdftext.value = "";
      // remove the uploaded PDF
      removeUpload();
      download.style.display = "none";
      alert("Extracted text downloaded successfully");
    } else {
      alert("No text available to download");
    }
  });
});


/* function to remove the uploaded PDF */
function removeUpload() {
  var fileInput = document.getElementById('file-upload-input');
  fileInput.value = ''; // Clear the file input
  var fileUploadContent = document.querySelector('.file-upload-content');
  fileUploadContent.style.display = 'none';
  var imageUploadWrap = document.querySelector('.image-upload-wrap');
  imageUploadWrap.style.display = 'block';
}

