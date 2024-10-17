

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

    <div class="formContainer">

        <form class="fileForm" id="uploadBankMovements" method="post" enctype="multipart/form-data" style="margin-bottom: 12px;">
            <p class="dropperText">Selecciona Excel Bancario</p>
            <input type="file" name="bankFile" id="bankFile" accept=".xlsx">
            <input class="sbmt" type="submit" value="Subir excel Bancario" name="submit">
        </form>

        <div class="divider"></div>
        
        <form class="fileForm" id="uploadTributarieExcel" method="post" enctype="multipart/form-data">
            <p class="dropperText">Selecciona Excel Tributario</p>
            <input type="file" name="tributarieFile" id="tributarieFile" accept=".xlsx">
            <input class="sbmt" type="submit" value="Subir excel tributario" name="submit">
        </form>
    </div>


    <!-- <form action="/file-upload"
      class="dropzone"
      id="bank-movements-drop">
      <button >adads</button>
    </form> -->


</div>

<style>
    .formContainer{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 20px;

    }
    .fileForm{
        display: flex;
        flex-direction: column;
        justify-content: start;
        gap: 12px;
        width: 50%;
    }

    .sideMenu-s p {
        line-height: 30px!important;
    }
    .dropperText{
        font-size: 16px;
        font-weight: 600;
    }
    .divider{
        width: 100%;
        height: 1px;
        background: #E5E5E5;
    }

    .fileForm{
        .sbmt{
            display: flex;
            cursor: pointer;
            height: 40px;
            padding: 0px 16px;
            justify-content: center;
            align-items: center;
            gap: 8px;
            align-self: stretch;
            border-radius: 6px;
            background: var(--Cyan-primario, #00C7D4);
            border: none;
            color: #FFF;
            font-family: Inter;
            font-size: 16px;
            font-style: normal;
            font-weight: 600;
            line-height: 24px;
            transition: all 0.3s ease;
        }
        .sbmt:hover {
            background-color: #048a87;
        }
    }
</style>

<script>
    // submit form
    document.getElementById('uploadBankMovements').addEventListener('submit', function(e){
        e.preventDefault();
        var formData = new FormData();
        formData.append('fileType', 'bankMovements');
        formData.append('file', document.getElementById('bankFile').files[0]);
        fetch('./controller/ExcelManager/writeBankExcel.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);



            const excelData = asd;


            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    document.getElementById('uploadTributarieExcel').addEventListener('submit', function(e){
        e.preventDefault();
        var formData = new FormData();

        formData.append('fileType', 'tributarie');
        formData.append('file', document.getElementById('tributarieFile').files[0]);
        fetch('./controller/ExcelManager/writeTributarieExcel.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log(data);
            console.log(data);
            console.log(data);
            // window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });


  // Dropzone has been added as a global variable.
    // Dropzone.options.bankMovementsDrop = {
    //     paramName: "file", // The name that will be used to transfer the file
    //     maxFilesize: 4, // MB,
    //     maxFiles: 1,
    //     autoProcessQueue: false,
    //     acceptedFiles: ".xlsx",
    //     dictDefaultMessage: "Arrastra el archivo bancario aquí para subirlo",
    //     dictFallbackMessage: "Tu navegador no soporta la carga de archivos por arrastrar y soltar.",
    //     dictFallbackText: "Por favor utiliza el formulario de abajo para subir tus archivos como en los viejos tiempos.",
    //     dictFileTooBig: "El archivo es muy grande ({{filesize}}MiB). Tamaño máximo: {{maxFilesize}}MiB.",
    //     dictInvalidFileType: "No puedes subir archivos de este tipo.",
    //     dictResponseError: "Server responded with {{statusCode}} code.",
    //     dictCancelUpload: "Cancelar subida",
    //     dictCancelUploadConfirmation: "¿Estás seguro de que quieres cancelar esta subida?",
    //     dictRemoveFile: "Eliminar archivo",
    //     dictMaxFilesExceeded: "No puedes subir más archivos.",
    //     init: function() {
    //     this.on("addedfile", function(file) {
    //         // Create the remove button
    //         var removeButton = Dropzone.createElement("<button class='fileUploadBtn'>Quitar Documento</button>");
    
    //         // Capture the Dropzone instance as closure.
    //         var _this = this;
    
    //         // Listen to the click event
    //         removeButton.addEventListener("click", function(e) {
    //             // Make sure the button click doesn't submit the form:
    //             e.preventDefault();
    //             e.stopPropagation();
    //             // Remove the file preview.
    //             _this.removeFile(file);
    //             // If you want to the delete the file on the server as well,
    //             // you can do the AJAX request here.

    //             // get document name 
    //             var fileName = file.name;
    //             // get the file extension
    //             var fileExtension = fileName.split('.').pop();
    //             // get the file name without extension
    //             var fileNameWithoutExtension = fileName.split('.').shift();
    //             // get the file path
    //             var filePath = file.upload.filename;
    //             // get the file size
    //             var fileSize = file.size;
    //             // get the file type
    //             var fileType = file.type;
    //             // get the file last modified date
    //             var fileLastModifiedDate = file.lastModifiedDate;
                
    //             // print all the file details
    //             console.log('File Name: ' + fileName);
    //             console.log('File Extension: ' + fileExtension);
    //             console.log('File Name Without Extension: ' + fileNameWithoutExtension);
    //             console.log('File Path: ' + filePath);

    //         });
    
    //         // Add the button to the file preview element.
    //         file.previewElement.appendChild(removeButton);
    //     });
    //     this.on("success", function(file, response) {
            
    //         // get document and fetch php file

    //         console.log(file)



    //     });
    //     }
    // };
</script>