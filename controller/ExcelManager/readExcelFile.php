<?php
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        require_once './ExcelManager.php'; 
        // get post data 
        $data = json_decode(file_get_contents('php://input'), true);
        $fileType = $data['fileType'];

        // $excelManager = new ExcelManager($fileType);

        if(isset($data['bankAccountNumber'])){
            $bankAccountNumber = $data['bankAccountNumber'];
            $excelManager = new ExcelManager($fileType,$bankAccountNumber);   
                    echo json_encode($excelManager->readExcel());
        exit;
            echo json_encode(["2"]);
            exit;         
        }else{
            $excelManager = new ExcelManager($fileType);
        }
        // echo json_encode(["2"]);
        // exit;
        // echo json_encode($excelManager->readExcel());
        // exit;
        
        if(isset($excelManager->readExcel()['status'])){
            echo $excelManager->readExcel()['message'];
        }
        // print data
        echo json_encode($excelManager->readExcel());
    }else{
        echo json_encode(['error' => 'Método no permitido']);
    }
?>