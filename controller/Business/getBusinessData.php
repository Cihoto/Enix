<?php
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        require_once '../session/sessionManager.php';
        $sessionManager = new sessionManager();
        $superAdmin = $sessionManager->get('superAdmin');
        if(!$superAdmin){
            echo json_encode(['error' => 'You are not allowed to perform this action.']);
        }

        // get post businessId
        $data = json_decode(file_get_contents('php://input'), true);
        $businessId = $data['businessId'];

        require_once './Bussiness.php';
        $business = new Business($businessId);


        $businesses = $business->setBusiness();

        if(!$businesses){
            echo json_encode(['error' => 'No business found']);
            exit;
        }
        
        $businessData = $business->getBankByBusinessId();


        if(!$businessData){
            echo json_encode(['error' => 'No bank account found']);
            exit;
        }

        $sessionManager->setBusinessId($business->getBusinessRut());
        $sessionManager->setBusinessName($business->getBusinessName());
        $sessionManager->setBusinessBankAccounts($business->getBusinessBankAccounts());
        
        $sessionManager->set('businessName', $sessionManager->getBusinessName());
        $sessionManager->set('businessId', $sessionManager->getBusinessId());
        $sessionManager->set('businessBankAccounts', $sessionManager->getBusinessBankAccounts());
        $sessionManager->set('loggedin', true);
        $sessionManager->set('busBdId', $businessId);
        echo json_encode(["error"=>true, 'businessData' => $businessData]);
    }else{
        echo json_encode(['error' => 'Método no permitido']);
    }
?>