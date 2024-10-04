<?php 
    require_once $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';
    require_once $_SERVER['DOCUMENT_ROOT'].'/controller/session/sessionManager.php';
    use Box\Spout\Reader\Common\Creator\ReaderEntityFactory;

    class ExcelManager extends sessionManager {
        private $fileType;

        public function __construct($fileType) {
            $this->fileType = $fileType;
        }

        public function readExcel() {

            $fileType = $this->getFileTypePath();
            if(!$fileType) {
                return json_encode(['status' => 'error', 'message' => 'Invalid folder type']);
            }
            $rootPath = $_SERVER['DOCUMENT_ROOT'];

            $data = [
                "headers"=>[],
                "bodyRows"=>[]
            ];

            $filePath = $rootPath.$fileType;
            // $path = 'C:\Users\CoteL\Desktop\masivas finanzas Enix\INTEC.xlsx';
            
            # open the file
            $reader = ReaderEntityFactory::createXLSXReader();
            
            try {
                $reader->open($filePath);
            } catch (\Box\Spout\Common\Exception\IOException $e) {
                return $data;
            } catch (\Exception $e) {
                return $data;
            }
           

            
            # read each cell of each row of each sheet
            foreach ($reader->getSheetIterator() as $sheetIndex=>$sheet) {
                foreach ($sheet->getRowIterator() as $rowIndex => $row) {
                    $newRow = [];
                    $newObj = new stdClass();
                    foreach ($row->getCells() as $cellIndex => $cell) {
                        if ($rowIndex == "1" && $sheetIndex == 1) {
                            $newRow[] = $cell->getValue();
                        }else{
                            $newObj->{$data["headers"][$cellIndex]} = $cell->getValue();
                        }
                    }
                    if ($rowIndex == "1" && $sheetIndex == 1) {
                        $data["headers"] = $newRow;
                    } else { 
                        $data["bodyRows"][] = $newObj;
                    }
                }
            }
            $reader->close();
            return $data;
        }

        public function getFileTypePath() {
            $fileType = $this->fileType;
            switch ($fileType) {
                case 'bankMovements':
                    $fileName = $this->getBankMovementFileName();
                    return "/BS_FILES/bank_movements/$fileName";
                    break;
                case 'tributarie':
                    $fileName = $this->getTributarieDocumentsFileName();
                    return "/BS_FILES/tributarie_documents/$fileName";
                    break;
                case 'modifiedMovements':
                    $fileName = $this->getModifiedMovementFileName();
                    return "/modFiles";
                    break;
                default:
                    return false;
                    break;
            }
        }


        public function getBankMovementFileName() {
            $businessId = $this->get('businessId');
            $businessBankAccount = $this->get('businessBankAccount');
            $businessName = $this->get('businessName');
            return "/$businessId$businessBankAccount"."_"."$businessName.xlsx";
        }

        public function getTributarieDocumentsFileName() {
            $businessId = $this->get('businessId');
            $businessName = $this->get('businessName');
            return "/$businessId"."_"."$businessName.xlsx";
        }
        public function getModifiedMovementFileName(){
            $businessId = $this->get('businessId');
            $businessName = $this->get('businessName');
            return "/MOD_$businessId"."_"."$businessName.xlsx";
        }
    }



?>