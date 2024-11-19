<?php 
    if($_SERVER['REQUEST_METHOD'] == 'GET') {
        require_once $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/TributarieDocuments/TributarieDocuments.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Business/Bussiness.php';
        
        header("Content-Type: application/json; charset=UTF-8");
        
        $business = new Business();
        $businessId = $business->getDatabaseBusinessId();
        $tributarieDocuments = new TributarieDocuments();
        $tributarieDocuments->setBusinessId($businessId);
        $response = $tributarieDocuments->getTributarieDocuments();

        if($response['success']) {
            echo json_encode(["success"=>true, "data"=>$response['data']]);
            // end the script
            exit;
        }
        else {
            echo json_encode(["success"=>false, "message"=>$response['message']]);
            exit;
        }
    }
    else {
        echo json_encode(['message' => 'Método no permitido']);
    }
?>