<?php 
    header("Content-Type: application/json; charset=UTF-8");    
    if($_SERVER['REQUEST_METHOD'] == 'GET'){
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/financialStatus/FinancialStatus.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Business/Bussiness.php';

        $financialStatus = new FinancialStatus();
        $business = new Business();

        $businessId = $business->getDatabaseBusinessId();
        $financialStatus->setBusinessId($businessId);

        $financialStatusData = $financialStatus->getFinancialStatus();

        if($financialStatusData['success']){
            echo json_encode(['success'=>true,'data' => $financialStatusData['data']]);
            exit();
        }else{
            echo json_encode(['success'=>false,'data'=>[]]);
            exit();
        }
    }else{
        echo json_encode(['success'=>false,'data'=>[]]);
        exit();
    }
?>