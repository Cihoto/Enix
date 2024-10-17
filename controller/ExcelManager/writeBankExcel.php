<?php
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file'])) {
        require_once '../ExcelManager/ExcelManager.php';
        $file = $_FILES['file'];
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];
        $fileType = $file['type'];

        $fileExt = explode('.', $fileName);
        $fileActualExt = strtolower(end($fileExt));

        $allowed = array('xlsx');

        if (in_array($fileActualExt, $allowed)) {
            if ($fileError === 0) {
                $excelManager = new ExcelManager('bankMovements');
                $fileName = $excelManager->getBankMovementFileName();
                // $fileNameNew = uniqid('', true).".".$fileActualExt;
                $fileDestination = $_SERVER['DOCUMENT_ROOT'].'/BS_FILES/bank_movements/'.$fileName;
                // echo $fileName;
                // echo '<br>';
                // echo  $fileDestination;
                // exit;
                move_uploaded_file($fileTmpName, $fileDestination);

                // Read uploaded file
                $excelData = $excelManager->readExcel($fileDestination);
                $sessionManager = new SessionManager();
                $bankAccountNumber = $sessionManager->get('businessBankAccounts')[0]['account_number'];
                $excelManager = new ExcelManager("bankMovements",$bankAccountNumber);         
                $data = $excelManager->readExcel()['bodyRows'];


                // fetch data from excel file and get min fecha['date'] and max fecha['date']
                // read date time object from excel file
                //
                //
                $minDate = null;
                $maxDate = null;
                // print_r($data[0]->fecha);

                foreach ($data as $row) {
                    $date =  $row->fecha;
                    if ($date) {
                        if (is_null($minDate) || $date < $minDate) {
                            $minDate = $date;
                        }
                        if (is_null($maxDate) || $date > $maxDate) {
                            $maxDate = $date;
                        }
                    }
                }

                $minDate = $minDate ? $minDate->format('Y-m-d') : null;
                $maxDate = $maxDate ? $maxDate->format('Y-m-d') : null;

                echo json_encode(["success"=>true, 'message' => 'File uploaded successfully!',"data"=>$data,"minDate"=>$minDate,"Maxdate"=>$maxDate]); 

            } else {
                echo json_encode(['error' => 'There was an error uploading your file!']);
            }
        } else {
            echo json_encode(['error' => 'You cannot upload files of this type!']);
        }


    } else {
        echo json_encode(['error' => 'Method not allowed']);
    }
?>