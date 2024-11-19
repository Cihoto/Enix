<?php

    if($_SERVER['REQUEST_METHOD'] == 'PATCH') {
        require_once $_SERVER['DOCUMENT_ROOT'] . '/controller/database/bd.php';
        require_once $_SERVER['DOCUMENT_ROOT'] . '/controller/TributarieDocuments/TributarieDocuments.php';
        require_once $_SERVER['DOCUMENT_ROOT'] . '/controller/Business/Bussiness.php';
        header("Content-Type: application/json; charset=UTF-8");

        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['rowId'];
        $tributarieDocuments = new TributarieDocuments();
        $business = new Business();
        $businessId = $business->getDatabaseBusinessId();

        $tributarieDocuments->setBusinessId($businessId);
        $tributarieDocuments->setId($id);

        $response = $tributarieDocuments->markAsPaid($id);

        if($response['success']) {
            echo json_encode(['success'=>true,'message' => 'Documentos tributarios marcados como pagados correctamente' ]);
            exit;
        }else {
            echo json_encode(['success'=>false, 'message' => 'Error al marcar documentos tributarios como pagados', $response ]);
            exit;
        }
    }
    else {
        echo json_encode(['success'=>false,'message' => 'Método no permitido']);
    }
?>