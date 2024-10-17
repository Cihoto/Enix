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
        }else{
            $excelManager = new ExcelManager($fileType);
        }
        echo json_encode(["success"=>true,"data"=>$excelManager->readExcel()]);
    }else{
        echo json_encode(['success' =>false,"message" => 'Método no permitido']);
    }
?>