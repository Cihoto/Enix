<?php 
    header("Content-Type: application/json; charset=UTF-8");    
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/financialStatus/FinancialStatus.php';
        require_once $_SERVER['DOCUMENT_ROOT'].'/controller/Business/Bussiness.php';

        $data = json_decode(file_get_contents('php://input'), true);
        $dateFrom = $data['dateFrom'];
        $dateTo = $data['dateTo'];

        $financialStatus = new FinancialStatus();
        $business = new Business();

        $businessId = $business->getDatabaseBusinessId();
        $financialStatus->setBusinessId($businessId);

        $financialStatusData = $financialStatus->getFinancialStatus_range($dateFrom,$dateTo);

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