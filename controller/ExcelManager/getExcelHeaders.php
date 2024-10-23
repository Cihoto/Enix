<?php
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

        $allowed = ['xlsx'];

        if (in_array($fileActualExt, $allowed)) {
            if ($fileError === 0) {
                

                echo json_encode(["success"=>true, 'message' => 'File uploaded successfully!',"data"=>$data,"minDate"=>$minDate,"Maxdate"=>$maxDate]); 

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