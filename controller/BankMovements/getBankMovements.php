<?php
    require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Business/Bussiness.php';
    if($_SERVER['REQUEST_METHOD'] === "GET") {
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/database/bd.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/BankMovements/BankMovements.php';
         
        $business = new Business();
        $business_id = $business->getDatabaseBusinessId();
        $bankMovements = new BankMovements(null,null,null,null,null,null,null,null,null,null,null,$business_id);
        $result = $bankMovements->getBankMovements();

        if($result['success']) {
            echo json_encode(['success' => $result['success'], 'data' => $result['data']]);
        }else{
            echo json_encode(["success"=>$result['success'], "error"=>"Error al obtener los movimientos bancarios"]);
        }
    }else{
        echo json_encode(["success"=>false, "error"=>"Error al obtener los movimientos bancarios"]);
    }
?>