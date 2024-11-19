<?php 

require_once $_SERVER['DOCUMENT_ROOT'].'/controller/database/bd.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Business/Bussiness.php';
require_once './BankMovements.php';

if($_SERVER['REQUEST_METHOD'] === "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $movements = $data['movements'];
    $business = new Business();
    $business_id = $business->getDatabaseBusinessId();

    // create a new BankMovements object
    $bankMovements = new BankMovements(null,null,null,null,null,null,null,null,null,null,null,$business_id);
    $deleteResult = $bankMovements->deleteAllBankMovements();
    $result = $bankMovements->createBatch($movements);

    // print_r($movements);
    // exit();

    if($result) {
        echo json_encode(array('success' => 'Movimiento bancario creado con éxito'));
    }else{
        echo json_encode(array('error' => 'Error al crear el movimiento bancario'));
    }
}else{
    echo json_encode(array('error' => 'Método no permitido'));
}


?>