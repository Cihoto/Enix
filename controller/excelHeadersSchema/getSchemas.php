<?php 
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/excelHeadersSchema/ExcelHeadersSchema.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/session/sessionManager.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Business/Bussiness.php';
        
        $sessionManager = new SessionManager();
        $business = new Business();

        $business_rut = $sessionManager->get('businessId');
        $business_id = $business->getBdBusinessId($business_rut);

        $excelHeadersSchema = new ExcelHeadersSchema(null, null,null, $business_id);
        $schemas = $excelHeadersSchema->getSchemas();
        
        echo json_encode($schemas);
    }
?>