<?php
// include_once '../../session/sessionManager.php';
include_once $_SERVER['DOCUMENT_ROOT'].'\controller\session\sessionManager.php';
class FileManager {
    private $filePath,$fullPath;
    

    public function __construct($filePath) {
        $this->filePath = $filePath;
    }

    public function readCommonMovements(){
        $sessionManager = new SessionManager();
        $sessionData = $sessionManager->getAllSessionData();
        $businessId = $sessionData['businessId'];
        $businessName = $sessionData['businessName'];
        $businessAccount = $sessionData['businessBankAccounts'][0]['account_number'];
        
        $rootFolder = $this->filePath ;
        $filePath = $rootFolder. "/$businessId$businessAccount"."_"."$businessName.json";
        $this->fullPath = $filePath;    
        // return $this->filePath;
        // return $fileRoot;
        if (!is_dir($rootFolder)) {
            //Create file on path
            mkdir($rootFolder, 0777, true);
        }
        if (!file_exists($filePath)) {
            file_put_contents($filePath, '');
        }

        $commonMovements = file_exists($filePath) != '' ? json_decode(file_get_contents($filePath), true) :[]; 

        // check if data is null
        if (empty($commonMovements)) {
            return ['status' => 'error', 'message' => 'No data to save','path'=>$filePath,"rootFolder"=>$rootFolder,"data"=>[]];
        }
        
        return  ['status' => 'success', 'message' => 'Data fetched successfully', "data" => $commonMovements];
    }

    public function readModifiedFile(){
        $sessionManager = new SessionManager();
        $businessId = $sessionManager->get('businessId');
        $businessName = $sessionManager->get('businessName');


        // return [$businessId,$businessName];
        
        $rootFolder = $this->filePath ;
        $filePath = $rootFolder. "/MOD_$businessId"."_"."$businessName.json";
        $this->fullPath = $filePath;    
        // return $this->filePath;
        // return $fileRoot;
        if (!is_dir($rootFolder)) {
            //Create file on path
            mkdir($rootFolder, 0777, true);
        }
        if (!file_exists($filePath)) {
            file_put_contents($filePath, '');
        }

        $commonMovements = file_exists($filePath) != '' ? json_decode(file_get_contents($filePath), true) :[]; 

        // check if data is null
        if (empty($commonMovements)) {
            return ['status' => 'EMPTY', 'data'=>[]];
        }
        
        return  ['status' => 'success', 'message' => 'Data fetched successfully', "data" => $commonMovements];
    }


    public function writeModifiedDocuments($documents) {
        $fileContents = json_encode($documents, JSON_PRETTY_PRINT);

        if (!file_exists($this->fullPath)) {
            return ['status' => 'error', 'message' => 'No directory found'];
        }

        if(file_put_contents($this->fullPath, $fileContents)){
            return ['status' => 'success', 'message' => 'File written successfully'];
        }else{
            return ['status' => 'error', 'message' => 'Error writing file'];
        }
    }
    

    public function writeMovements($movements) {
        $fileContents = json_encode($movements, JSON_PRETTY_PRINT);

        if (!file_exists($this->fullPath)) {
            return ['status' => 'error', 'message' => 'No directory found'];
        }

        if(file_put_contents($this->fullPath, $fileContents)){
            return ['status' => 'success', 'message' => 'File written successfully'];
        }else{
            return ['status' => 'error', 'message' => 'Error writing file'];
        }
    }
}
?>