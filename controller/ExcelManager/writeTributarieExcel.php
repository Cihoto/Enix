<?php

    // echo json_encode(["method"=>isset($_FILES['file'])]);
    // exit;
    
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file'])) {
        require_once '../ExcelManager/ExcelManager.php';

        $file = $_FILES['file'];
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];
        $fileType = $file['type'];

        $fileExt = explode('.', $fileName);
        $fileActualExt = strtolower(end($fileExt));

        $allowed = array('xlsx');

        if (in_array($fileActualExt, $allowed)) {
            if ($fileError === 0) {
                $excelManager = new ExcelManager('tributarie');
                $fileName = $excelManager->getTributarieDocumentsFileName();
                // $fileNameNew = uniqid('', true).".".$fileActualExt;
                $fileDestination = $_SERVER['DOCUMENT_ROOT'].'/BS_FILES/tributarie_documents/'.$fileName;
                move_uploaded_file($fileTmpName, $fileDestination);
                echo json_encode(["success"=>true, 'message' => 'File uploaded successfully!']); ;

            } else {
                echo json_encode(['error' => 'There was an error uploading your file!']);
            }
        } else {
            echo json_encode(['error' => 'You cannot upload files of this type!']);
        }


    } else {
        echo json_encode(['error' => 'Method not allowed']);
    }
?>