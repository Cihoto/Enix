<?php 
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/excelHeadersSchema/excelHeadersSchema.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/session/sessionManager.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Business/Bussiness.php';
        
        $sessionManager = new SessionManager();
        $business = new Business();

        $data = json_decode(file_get_contents('php://input'), true);
        $schema_name = $data['schema_name'];
        $schema = json_encode($data['headersSchema']);
        $schema_type = $data['schema_type'];
        $business_rut = $sessionManager->get('businessId');
        $business_id = $business->getBdBusinessId($business_rut);

        $excelHeadersSchema = new ExcelHeadersSchema($schema_name, $schema,$schema_type, $business_id);
        if($excelHeadersSchema->newSchema()){
            echo json_encode(array('success'=>true,'status' => 'success', 'message' => 'Schema created successfully'));
        } else {
            echo json_encode(array('success'=>false,'status' => 'error', 'message' => 'Error creating schema'));
        }
    }
?>