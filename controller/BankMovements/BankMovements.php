<?php
    require_once $_SERVER['DOCUMENT_ROOT'].'/vendor/autoload.php';
    require_once $_SERVER['DOCUMENT_ROOT'].'/controller/database/bd.php';

    use Ramsey\Uuid\Uuid;

class BankMovements
{
    private $id;
    private $folio;
    private $amount;
    private $date;
    private $income;
    private $comment;
    private $desc;
    private $bank;
    private $account_number;
    private $counterparty;
    private $rut_counterparty;
    private $business_id;

    public function __construct($id = null, $folio = null, $amount = null, $date = null, $income = null, $comment = null, $desc = null, $bank = null, $account_number = null, $counterparty = null, $rut_counterparty = null, $business_id = null)
    {
        $this->id = $id;
        $this->folio = $folio;
        $this->amount = $amount;
        $this->date = $date;
        $this->income = $income;
        $this->comment = $comment;
        $this->desc = $desc;
        $this->bank = $bank;
        $this->account_number = $account_number;
        $this->counterparty = $counterparty;
        $this->rut_counterparty = $rut_counterparty;
        $this->business_id = $business_id;
    }

    // Getters
    public function getId()
    {
        return $this->id;
    }
    public function getFolio()
    {
        return $this->folio;
    }
    public function getAmount()
    {
        return $this->amount;
    }
    public function getDate()
    {
        return $this->date;
    }
    public function getIncome()
    {
        return $this->income;
    }
    public function getComment()
    {
        return $this->comment;
    }
    public function getDesc()
    {
        return $this->desc;
    }
    public function getBank()
    {
        return $this->bank;
    }
    public function getAccountNumber()
    {
        return $this->account_number;
    }
    public function getCounterparty()
    {
        return $this->counterparty;
    }
    public function getRutCounterparty()
    {
        return $this->rut_counterparty;
    }
    public function getBusinessId()
    {
        return $this->business_id;
    }

    // Setters
    public function setId($id)
    {
        $this->id = $id;
    }
    public function setFolio($folio)
    {
        $this->folio = $folio;
    }
    public function setAmount($amount)
    {
        $this->amount = $amount;
    }
    public function setDate($date)
    {
        $this->date = $date;
    }
    public function setIncome($income)
    {
        $this->income = $income;
    }
    public function setComment($comment)
    {
        $this->comment = $comment;
    }
    public function setDesc($desc)
    {
        $this->desc = $desc;
    }
    public function setBank($bank)
    {
        $this->bank = $bank;
    }
    public function setAccountNumber($account_number)
    {
        $this->account_number = $account_number;
    }
    public function setCounterparty($counterparty)
    {
        $this->counterparty = $counterparty;
    }
    public function setRutCounterparty($rut_counterparty)
    {
        $this->rut_counterparty = $rut_counterparty;
    }
    public function setBusinessId($business_id)
    {
        $this->business_id = $business_id;
    }

    // CRUD methods
    public function create()
    {
        $conn = new bd();
        $conn->conectar();

        $sql = "INSERT INTO bank_movement (folio, amount, date, income, comment, `desc`, bank, account_number, counterparty, rut_counterparty, business_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn->mysqli, $sql);
        $stmt->bind_param("sdssssssssi", $this->folio, $this->amount, $this->date, $this->income, $this->comment, $this->desc, $this->bank, $this->account_number, $this->counterparty, $this->rut_counterparty, $this->business_id);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            // close the statement and connection
            $stmt->close();
            $conn->desconectar();
            return ["success" => true, "message" => "Bank movement created successfully"];
        } else {
            // close the statement and connection
            $stmt->close();
            $conn->desconectar();
            return ["success" => false, "message" => "Error creating bank movement"];
        }
    }

    public function createBatch($bankMovements)
    {
        $conn = new bd();
        try {
            $conn->conectar();

            $query = "INSERT INTO bank_movement (id, folio, amount, date, income, comment, `desc`, bank, account_number, counterparty, rut_counterparty, business_id,external_id) VALUES ";
            $values = [];
            $types = '';
            $params = []; 



            foreach ($bankMovements as $movement) {
                if (empty($movement['amount'])) {
                    continue;
                }

                // CHECK IF MOVEMENT HAS ID IF NOT CREATE A NEW ONE
                if (empty($movement['id'])) {
                    // merge on first position
                    $uuid = Uuid::uuid4();
                    $movement = array_merge(['id' => $uuid], $movement);
                    // $movement['id'] = \Ramsey\Uuid\Uuid::uuid4();

                }

                if (empty($movement['business_id'])) {
                    // merge on last position
                    $movement = array_merge($movement, ['business_id' => $this->business_id]);
                }

                if (empty($movement['external_id'])) {

                    $values[] = "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    $types .= 'ssissssssssi';
                } else {
                    $values[] = "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
                    $types .= 'ssissssssssis';
                }

                $params = array_merge($params, array_values($movement));
            }

            $query .= implode(', ', $values);
            $stmt = mysqli_prepare($conn->mysqli, $query);
            $stmt->bind_param($types, ...$params);

            mysqli_stmt_execute($stmt);

            if ($stmt->affected_rows === 0) {
                $stmt->close();
                $conn->desconectar();
                return ["success" => false, "message" => "Error creating bank movements"];
            }

            $stmt->close();
            $conn->desconectar();
            return ["success" => true, "message" => "Batch bank movements created successfully"];
        } catch (Exception $e) {
            $conn->desconectar();
            return ["success" => false, "message" => "Error creating bank movements"];

        }
    }

    public function read($conn, $id)
    {
        $sql = "SELECT * FROM bank_movement WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $this->id = $row['id'];
            $this->folio = $row['folio'];
            $this->amount = $row['amount'];
            $this->date = $row['date'];
            $this->income = $row['income'];
            $this->comment = $row['comment'];
            $this->desc = $row['desc'];
            $this->bank = $row['bank'];
            $this->account_number = $row['account_number'];
            $this->counterparty = $row['counterparty'];
            $this->rut_counterparty = $row['rut_counterparty'];
            $this->business_id = $row['business_id'];
        }
        $stmt->close();
    }

    public function update($conn)
    {
        $sql = "UPDATE bank_movement SET folio = ?, amount = ?, date = ?, income = ?, comment = ?, `desc` = ?, bank = ?, account_number = ?, counterparty = ?, rut_counterparty = ?, business_id = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sdssssssssii", $this->folio, $this->amount, $this->date, $this->income, $this->comment, $this->desc, $this->bank, $this->account_number, $this->counterparty, $this->rut_counterparty, $this->business_id, $this->id);
        $stmt->execute();
        $stmt->close();
    }

    public function deleteAllBankMovements()
    {
        try {
            $conn = new bd();
            $conn->conectar();
            $stmt = mysqli_prepare($conn->mysqli, "DELETE FROM bank_movement WHERE business_id = ?");
            $stmt->bind_param("i", $this->business_id);
            $stmt->execute();
            $stmt->close();
            $conn->desconectar();
            return ['success' => true, 'message' => 'Movimientos bancarios eliminados con éxito'];
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Error al eliminar los movimientos bancarios'];
        }
    }

    public function getBankMovements()
    {
        try {
            $conn = new bd();
            $conn->conectar();
            $stmt = mysqli_prepare($conn->mysqli, "SELECT * FROM bank_movement WHERE business_id = ?");
            $stmt->bind_param("i", $this->business_id);
            $stmt->execute();

            $result = $stmt->get_result();
            $movements = [];
            while ($row = $result->fetch_assoc()) {
                $movements[] = $row;
            }

            $stmt->close();
            $conn->desconectar();
            return ["success" => true, "data" => $movements];
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Error al obtener los movimientos bancarios'];
        }
    }


    // function getClayApiMovements($business_rut,$dateFrom) {


    //     try{
    //         //get first day if the month YYYY-MM-DD
    //         $firstDayOfTheYear = date('Y-01-01');

    //         // create a get fetch request to https://api.clay.cl/v1/cuentas_bancarias/movimientos/?numero_cuenta=63741369&rut_empresa=77604901&limit=200&offset=0&fecha_desde=2020-01-01
    //         // to get the bank movements of the company
    //         // USING PHP

    //         $response = [];
    //         $offset = 0;
    //         $loopCounter = 0;
    //         $responseNeedRepeat = true;

    //         $accountNumber = $this->getAccountNumber();

    //         while ($responseNeedRepeat) {
    //             $loopCounter++;
    //             $curl = curl_init();
    //             curl_setopt_array($curl, array(
    //                 CURLOPT_URL => "https://api.clay.cl/v1/cuentas_bancarias/movimientos/?numero_cuenta=$accountNumber&rut_empresa=$business_rut&limit=200&offset=$offset&fecha_desde=2024-11-01",
    //                 CURLOPT_RETURNTRANSFER => true,
    //                 CURLOPT_ENCODING => '',
    //                 CURLOPT_MAXREDIRS => 10,
    //                 CURLOPT_TIMEOUT => 0,
    //                 CURLOPT_FOLLOWLOCATION => true,
    //                 CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    //                 CURLOPT_CUSTOMREQUEST => 'GET',
    //                 CURLOPT_HTTPHEADER => array(
    //                     'accept: application/json',
    //                     'Token: 9NVElUwIrrQPXFU0VSVD9zfeP5i2PWAbrONlc0lQM-0TfHj0a6AQ2wbI-eg01mTj_ZnZLV6q4d2hLU86AXntfY'
    //                 ),
    //             ));

    //             // echo "https://api.clay.cl/v1/cuentas_bancarias/movimientos/?numero_cuenta=$bankAcocuntId&rut_empresa=$busId&limit=200&offset=$offset&fecha_desde=2024-07-10";

    //             $curl_response = curl_exec($curl);
    //             // return $curl_response;
    //             $newItems = json_decode($curl_response, true)['data']['items'];

    //             if ($loopCounter == 1) {
    //                 $response = json_decode($curl_response, true);
    //             } else {
    //                 $response['data']['items'] = array_merge($response['data']['items'], $newItems);
    //             }

    //             $currentItems = count($newItems);
    //             $offset = $loopCounter * 200;
    //             $responseNeedRepeat = $currentItems == 200;
    //             curl_close($curl);
    //         }
    //         // return ['success' => true, "data"=>$response,'message' => 'Movimientos bancarios obtenidos con éxito'];

    //         // return $response;


    //         //GET THE BANK MOVEMENTS FROM THE RESPONSE
    //         // MAP ARRAY FOR BATCH INSERT INTO DATABASE

    //         // get business id


    //         $bankMovements = $response['data']['items'];
    //         $bankMovements = array_map(function($movement) {
    //             return [
    //                 'id' => $movement['id'],
    //                 'folio' => $movement['numero_documento'],
    //                 'amount' => $movement['monto'],
    //                 'date' => $movement['fecha_humana'],
    //                 'income' => $movement['abono'],
    //                 'comment' => !empty($movement['mas_info']['mensaje']) ? $movement['mas_info']['mensaje'] : "",
    //                 'desc' => $movement['descripcion'],
    //                 'bank' => !empty($movement['mas_info']['banco']) ? $movement['mas_info']['banco'] : "",
    //                 'account_number' => !empty($movement['mas_info']['numero_cuenta']) ? $movement['mas_info']['numero_cuenta'] : "",
    //                 'counterparty' => !empty($movement['mas_info']['contraparte']) ? $movement['mas_info']['contraparte'] : "",
    //                 'rut_counterparty' => !empty($movement['mas_info']['rut_contraparte']) ? $movement['mas_info']['rut_contraparte'] : "",
    //                 'business_id' => $this->getBusinessId()
    //             ];
    //         }, $bankMovements);

    //         $response = $this->createBulkFromApi($bankMovements);
    //         // $response = $this->createBatch($bankMovements);
    //         return ['success' => true, "data"=>$response,'message' => 'Movimientos bancarios obtenidos con éxito', "bathcData" => $bankMovements];

    //         if(!$response['success']) {
    //             return ['success' => true, "data"=>$response,'message' => 'Movimientos bancarios obtenidos con éxito', "bathcData" => $bankMovements];
    //             return ['success' => false, 'data'=>[],'message' => 'Error al guardar los movimientos bancarios'];
    //         }
    //         // echo json_encode($response);
    //     }catch (Exception $e) {

    //         return ["error"=>$e->getMessage()];
    //         // return ['success' => false, 'data'=>[],'message' => 'Error al obtener los movimientos bancarios'];
    //     }
    // }


    // function createBulkFromApi($bankMovements) {
    //     $conn = new bd();
    //     $conn->conectar();
    //     $params = [];

    //     // Get the max date from the bankMovements array
    //     $dates = array_column($bankMovements, 'date');
    //     $maxDate = max($dates);


    //     // Execute this only if incoming array contains id property

    //     //getAll ids from the array
    //     $ids = array_column($bankMovements, 'id');
    //     $ids = array_filter($ids); // Remove null or empty IDs

    //     $placeholders = implode(',', array_fill(0, count($ids), '?'));

    //     $checkQuery = "SELECT * FROM bank_movement WHERE id IN ($placeholders) AND date = ?";
    //     $checkStmt = mysqli_prepare($conn->mysqli, $checkQuery);

    //     $params = array_merge($ids, [$maxDate]);
    //     $checkStmt->bind_param(str_repeat('s', count($ids) + 1), ...$params);

    //     // get results 
    //     $checkStmt->bind_param(str_repeat('s', count($ids)) . 's', ...$params);
    //     $checkStmt->store_result();
    //     $checkStmt->bind_result($id);
    //     $checkStmt->fetch();


    //     return ["success"=>true,"Data"=>$ids, "MaxDate"=>$maxDate, "CheckQuery"=>$checkQuery, "CheckStmt"=>$checkStmt, "CheckStmtResult"=>$checkStmt->num_rows];

    //     if ($checkStmt->num_rows > 0) {
    //         return ['success' => true, 'data' => [], 'message' => 'Movimientos bancarios ya existen en la base de datos'];
    //     }

    //     return ['success' => true, 'data' => [], 'message' => 'Movimientos bancarios obtenidos con éxito'];
    // }


    function getClayApiMovements($business_rut, $dateFrom)
    {
        // $ARR = [3,3,3,3];
        // $placeholders = implode(',', array_fill(0, count($ARR), '?'));

        // return $placeholders;
        // return str_repeat('s', count($ARR));

        // try {
        // Removed unused variable $firstDayOfTheYear

        // Create a GET fetch request to the API to get the bank movements of the company
        $response = [];
        $offset = 0;
        $loopCounter = 0;
        $responseNeedRepeat = true;

        $accountNumber = $this->getAccountNumber();

        while ($responseNeedRepeat) {
            $loopCounter++;
            $curl = curl_init();
            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://api.clay.cl/v1/cuentas_bancarias/movimientos/?numero_cuenta=$accountNumber&rut_empresa=$business_rut&limit=200&offset=$offset&fecha_desde=$dateFrom",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'GET',
                CURLOPT_HTTPHEADER => array(
                    'accept: application/json',
                    'Token: 9NVElUwIrrQPXFU0VSVD9zfeP5i2PWAbrONlc0lQM-0TfHj0a6AQ2wbI-eg01mTj_ZnZLV6q4d2hLU86AXntfY'
                ),
            ));

            $curl_response = curl_exec($curl);

            $newItems = json_decode($curl_response, true)['data']['items'];
            $newItems = json_decode($curl_response, true)['data']['items'];
            
            curl_close($curl); // Close curl before executing the next command
            if ($loopCounter == 1) {
                $response = json_decode($curl_response, true);
            } else {
                $response['data']['items'] = array_merge($response['data']['items'], $newItems);
            }

            $currentItems = count($newItems);
            $offset = $loopCounter * 200;
            $responseNeedRepeat = $currentItems == 200;
            curl_close($curl);
        }

        // Get the bank movements from the response and map the array for batch insert into the database
        $bankMovements = $response['data']['items'];
        $bankMovements = array_map(function ($movement) {
            return [
                'folio' => $movement['numero_documento'],
                'amount' => $movement['monto'],
                'date' => $movement['fecha_humana'],
                'income' => $movement['abono'],
                'comment' => !empty($movement['mas_info']['mensaje']) ? $movement['mas_info']['mensaje'] : "",
                'desc' => $movement['descripcion'],
                'bank' => !empty($movement['mas_info']['banco']) ? $movement['mas_info']['banco'] : "",
                'account_number' => !empty($movement['mas_info']['numero_cuenta']) ? $movement['mas_info']['numero_cuenta'] : "",
                'counterparty' => !empty($movement['mas_info']['contraparte']) ? $movement['mas_info']['contraparte'] : "",
                'rut_counterparty' => !empty($movement['mas_info']['rut_contraparte']) ? $movement['mas_info']['rut_contraparte'] : "",
                'business_id' => $this->getBusinessId(),
                'external_id' => $movement['id'],
            ];
        }, $bankMovements);

        $response = $this->createBulkFromApi($bankMovements);

        if(!$response['success']) {
            return ['success' => false, 'data' => [], 'message' => $response['message']];
        }
        
        return ['success' => true, "data" => $response, 'message' => 'Movimientos bancarios obtenidos con éxito', "batchData" => $bankMovements];

        // } catch (Exception $e) {

        // return ["error" => $e];
        // }
    }



    function createBulkFromApi($bankMovements){

        $conn = new bd();
        try {
            // return $bankMovements;
            $conn->conectar();
            $params = [];

            // Get the max date from the bankMovements array
            $dates = array_column($bankMovements, 'date');
            $maxDate = max($dates);

            // Get all ids from the array
            $ids = array_column($bankMovements, 'external_id');
            $ids = array_filter($ids); // Remove null or empty IDs
            $params = array_merge($ids, [$maxDate]);
            $placeholders = implode(',', array_fill(0, count($ids), '?'));

            // return ["S"=>count($params), "P"=>count($params), "PD"=>count(array_fill(0, count($ids), '?'))];

            $checkQuery = "SELECT * FROM bank_movement WHERE external_id IN ($placeholders)";

            // return $checkQuery;
            // return str_repeat('?,', count(...$params));
            // return str_repeat('?,', count($params));
            // return $checkQuery;

            $checkStmt = mysqli_prepare($conn->mysqli, $checkQuery);
            mysqli_stmt_bind_param($checkStmt, str_repeat('s', count($ids)), ...$ids);
            // $par1 = "!23123";
            // $par2 = "123123123";
            // mysqli_stmt_bind_param($checkStmt,'sss',$par1,$par2,$maxDate);

            // Execute the statement and fetch results
            $checkStmt->execute();

            $foundIds = [];
            $result = $checkStmt->get_result();
            while ($row = $result->fetch_assoc()) {
                $foundIds[] = $row;
            }
            // close the statement and connection
            $checkStmt->close();
            $conn->desconectar();

            // find all foundIds in BankMovements array and remove it from bankMovements array

            $toInsertMoves = array_filter($bankMovements, function ($movement) use ($foundIds) {
                return !in_array($movement['external_id'], array_column($foundIds, 'external_id'));
            });


            if (count($toInsertMoves) === 0) {
                return ['success' => true, 'data' => [], 'message' => 'Up to date bank movements'];
            }

            $response = $this->createBatch($bankMovements);

            if (!$response['success']) {
                return ['success' => false, 'data' => [], 'message' => 'Error creating bank movements'];
            }

            return ['success' => true, 'data' => [], 'message' => 'Bank movements created successfully'];
        } catch (Exception $e) {
            $conn->desconectar();
            return ["success" => false, "message" => "Error creating bank movements","error"=>$e];
        }
    }
}
