<?php

header("Content-Type: application/json; charset=UTF-8");
if($_SERVER['REQUEST_METHOD'] == 'GET') {
    require_once $_SERVER['DOCUMENT_ROOT'] . '/controller/database/bd.php';
    require_once $_SERVER['DOCUMENT_ROOT'] . '/controller/TributarieDocuments/TributarieDocuments.php';
    require_once $_SERVER['DOCUMENT_ROOT'] . '/controller/Business/Bussiness.php';

    $tributarieDocuments = new TributarieDocuments();
    $business = new Business();
    $businessId = $business->getDatabaseBusinessId();
    $tributarieDocuments->setBusinessId($businessId);
    $response = $tributarieDocuments->getModifiedDocuments();

    if($response['success']) {
        echo json_encode(['success'=>true,'message' => 'Documentos tributarios modificados obtenidos correctamente', 'data' => $response['data']]);
        exit;
    }else {
        echo json_encode(['success'=>false, 'message' => 'Error al obtener documentos tributarios modificados']);
        exit;
    }
}
else {
    echo json_encode(['success'=>false,'message' => 'Método no permitido']);
}

?>