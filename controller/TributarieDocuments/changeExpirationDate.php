<?php
    if($_SERVER['REQUEST_METHOD'] == 'PATCH') {
        require_once $_SERVER['DOCUMENT_ROOT'] . '/controller/database/bd.php';
        require_once $_SERVER['DOCUMENT_ROOT'] . '/controller/TributarieDocuments/TributarieDocuments.php';
        require_once $_SERVER['DOCUMENT_ROOT'] . '/controller/Business/Bussiness.php    ';
        header("Content-Type: application/json; charset=UTF-8");

        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['rowId'];
        $expirationDate = $data['date'];
        $tributarieDocuments = new TributarieDocuments();
        $business = new Business();
        $businessId = $business->getDatabaseBusinessId();

        $tributarieDocuments->setBusinessId($businessId);
        $tributarieDocuments->setId($id);
        $tributarieDocuments->setExpirationDate($expirationDate);

        $response = $tributarieDocuments->updateExpirationDate($id, $expirationDate);

        if($response['success']) {
            echo json_encode(['success'=>true,'message' => 'Fecha de vencimiento actualizada correctamente' ]);
            exit;
        }else {
            echo json_encode(['success'=>false, 'message' => 'Error al actualizar la fecha de vencimiento', $response ]);
            exit;
        }
    }
    else {
        echo json_encode(['success'=>false,'message' => 'Método no permitido']);
    }

?>