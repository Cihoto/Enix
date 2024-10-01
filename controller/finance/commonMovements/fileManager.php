<?php
include_once '../../session/sessionManager.php';
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
        $businessAccount = $sessionData['businessBankAccount'];
        
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
            return json_encode(['status' => 'error', 'message' => 'No data to save','path'=>$filePath,"rootFolder"=>$rootFolder]);
        }
        
        return  ['status' => 'success', 'message' => 'Data fetched successfully', "data" => $commonMovements];
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