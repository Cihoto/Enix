

<div id="sidemenuenueun" class="sideMenu-s">
    <button onClick="closeUploadFinanceFiles()" class="sideMenuBtn" id="closeSideMenuCommonMovements" style="border: none;background-color: none;padding: 30px;">
        <img src="./assets/svg/log-out.svg" alt="">
    </button>
    <div class="sideMenuHeader" style="align-items: center;align-content:center;margin-left: 14px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="6" fill="#069B99" />
        </svg>
        <p class="header-P">Sube el excel tipo para poder alimentar tu flujo de caja</p>
    </div>
    <form action="/file-upload"
      class="dropzone"
      id="my-awesome-dropzone">
    
    </form>


</div>

<script>
  // Dropzone has been added as a global variable.
    Dropzone.options.myAwesomeDropzone = {
        paramName: "file", // The name that will be used to transfer the file
        maxFilesize: 4, // MB
        acceptedFiles: ".xls,.xlsx",
        dictDefaultMessage: "Arrastra el archivo aquí para subirlo",
        dictFallbackMessage: "Tu navegador no soporta la carga de archivos por arrastrar y soltar.",
        dictFallbackText: "Por favor utiliza el formulario de abajo para subir tus archivos como en los viejos tiempos.",
        dictFileTooBig: "El archivo es muy grande ({{filesize}}MiB). Tamaño máximo: {{maxFilesize}}MiB.",
        dictInvalidFileType: "No puedes subir archivos de este tipo.",
        dictResponseError: "Server responded with {{statusCode}} code.",
        dictCancelUpload: "Cancelar subida",
        dictCancelUploadConfirmation: "¿Estás seguro de que quieres cancelar esta subida?",
        dictRemoveFile: "Eliminar archivo",
        dictMaxFilesExceeded: "No puedes subir más archivos.",
        init: function() {
        this.on("addedfile", function(file) {
            // Create the remove button
            var removeButton = Dropzone.createElement("<button class='fileUploadBtn'>Quitar Documento</button>");
    
            // Capture the Dropzone instance as closure.
            var _this = this;
    
            // Listen to the click event
            removeButton.addEventListener("click", function(e) {
                // Make sure the button click doesn't submit the form:
                e.preventDefault();
                e.stopPropagation();
                // Remove the file preview.
                _this.removeFile(file);
                // If you want to the delete the file on the server as well,
                // you can do the AJAX request here.

                // get document name 
                var fileName = file.name;
                // get the file extension
                var fileExtension = fileName.split('.').pop();
                // get the file name without extension
                var fileNameWithoutExtension = fileName.split('.').shift();
                // get the file path
                var filePath = file.upload.filename;
                // get the file size
                var fileSize = file.size;
                // get the file type
                var fileType = file.type;
                // get the file last modified date
                var fileLastModifiedDate = file.lastModifiedDate;
                
                // print all the file details
                console.log('File Name: ' + fileName);
                console.log('File Extension: ' + fileExtension);
                console.log('File Name Without Extension: ' + fileNameWithoutExtension);
                console.log('File Path: ' + filePath);

            });
    
            // Add the button to the file preview element.
            file.previewElement.appendChild(removeButton);
        });
        this.on("success", function(file, response) {
            console.log('aaasas')
            // fetch('/path/to/your/api', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ filename: file.name, filesize: file.size })
            // })
            // .then(response => response.json())
            // .then(data => {
            //     console.log('Success:', data);
            // })
            // .catch((error) => {
            //     console.error('Error:', error);
            // });
        });
        }
    };
</script>