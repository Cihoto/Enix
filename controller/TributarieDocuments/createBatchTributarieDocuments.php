<?php

    if($_SERVER['REQUEST_METHOD'] == 'POST') {
        require_once $_SERVER['DOCUMENT_ROOT'] . '/controller/database/bd.php';
        require_once $_SERVER['DOCUMENT_ROOT'] . '/controller/TributarieDocuments/TributarieDocuments.php';
        require_once $_SERVER['DOCUMENT_ROOT'] . '/controller/Business/Bussiness.php';
        header("Content-Type: application/json; charset=UTF-8");

        $data = json_decode(file_get_contents('php://input'), true);
        $documents = $data['documents'];
        $tributarieDocuments = new TributarieDocuments();
        $business = new Business();
        $businessId = $business->getDatabaseBusinessId();
        $tributarieDocuments->setBusinessId($businessId);


        $deleteTributarieResponse = $tributarieDocuments->deleteTributarieDocument();

        if(!$deleteTributarieResponse['success']) {
            echo json_encode(['success'=>false,'message' => 'Error al eliminar documentos tributarios']);
            exit;
        }

        $response = $tributarieDocuments->insertBatchTributarieDocuments($documents);

        if($response['success']) {
            echo json_encode(['success'=>true,'message' => 'Documentos tributarios creados correctamente', $response ]);
            exit;
        }else {
            echo json_encode(['success'=>false, 'message' => 'Error al crear documentos tributarios', $response ]);
            exit;
        }
    }
?>